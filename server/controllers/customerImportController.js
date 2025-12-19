const Customer = require('../models/Customer');
const WorkshopBooking = require('../models/workshopBooking');
const SellRequest = require('../models/sellRequest');
const TestDriveBooking = require('../models/testDriveBooking');
const InspectionBooking = require('../models/InspectionBooking');
const InsurancePolicy = require('../models/InsurancePolicy');
const CarRequirement = require('../models/CarRequirement');
const csv = require('csv-parser');
const fs = require('fs');
// Try to import ID generator, fallback if not found (though it should be there)
let generateCustomId;
try {
  const utils = require('../utils/idGenerator');
  generateCustomId = utils.generateCustomId;
} catch (e) {
  generateCustomId = async () => 'CUST-' + Date.now();
}

/**
 * Handle bulk import of customers and related data
 * OPTIMIZED: Uses Batch Operations to prevent 504 Timeouts
 */
exports.bulkImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { importType, defaultSource } = req.body; 
    const results = []; // We might not track per-row status in bulk for speed, but will return summary
    const errors = [];

    // Parse CSV
    const rows = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', async () => {
        
        // 1. PRE-PROCESS: Extract Clean Data
        const validRows = [];
        const mobileSet = new Set();
        
        // Helper currently duplicated, ideally move to utils but defining here for scope
        const getValue = (row, possibleKeys) => {
             const rowKeys = Object.keys(row);
             for (const key of possibleKeys) {
                 if (row[key]) return row[key];
                 const foundKey = rowKeys.find(k => k.toLowerCase().replace(/[^a-z]/g, '') === key.toLowerCase());
                 if (foundKey && row[foundKey]) return row[foundKey];
             }
             for (const search of possibleKeys) {
                 const foundKey = rowKeys.find(k => k.toLowerCase().includes(search.toLowerCase()));
                 if (foundKey && row[foundKey]) return row[foundKey];
             }
             return null;
        };

        for (const row of rows) {
            const rawMobile = getValue(row, ['mobile', 'phone', 'contact', 'mob', 'cell']);
            const mobile = cleanMobile(rawMobile);
            
            if (!mobile && importType !== 'insurance') {
                errors.push({ row, error: 'Missing mobile number' });
                continue;
            }

            // Standardize Row Data
            const processed = {
                originalRow: row,
                mobile,
                name: getValue(row, ['name', 'customer', 'customername', 'fullname']) || 'Unknown',
                email: getValue(row, ['email', 'mail']) || undefined,
                regNumber: getValue(row, ['reg', 'registration', 'regno', 'vehicleno', 'numberplate']),
                // Capture raw fields for spokes later
                city: row.city || row.address, // simple fallback
                rawSpokeData: row 
            };
            
            validRows.push(processed);
            if (mobile) mobileSet.add(mobile);
        }

        if (validRows.length === 0) {
             fs.unlinkSync(req.file.path);
             return res.json({ success: true, summary: { total: rows.length, imported: 0, failed: errors.length }, errors });
        }


        // 2. BATCH PROCESS IN CHUNKS
        // Vercel Serverless has timeouts, so we process in chunks of 500
        const CHUNK_SIZE = 500;
        let processedCount = 0;

        for (let i = 0; i < validRows.length; i += CHUNK_SIZE) {
            const chunk = validRows.slice(i, i + CHUNK_SIZE);
            const mobileSet = new Set(chunk.map(r => r.mobile));

            // A. Fetch Existing for this chunk
            const existingCustomers = await Customer.find({ mobile: { $in: Array.from(mobileSet) } });
            const customerMap = new Map(); 
            existingCustomers.forEach(c => customerMap.set(c.mobile, c));

            // B. Identify New vs Existing
            const newCustomerDocs = [];
            
            chunk.forEach((row, idxInChunk) => {
                if (!customerMap.has(row.mobile)) {
                     // Check if duplicate within this chunk
                     const alreadyInBatch = newCustomerDocs.find(d => d.mobile === row.mobile);
                     if (!alreadyInBatch) {
                        newCustomerDocs.push({
                            customId: 'IMP-' + Date.now() + '-' + (i + idxInChunk) + '-' + Math.floor(Math.random() * 1000),
                            name: row.name,
                            mobile: row.mobile,
                            email: row.email,
                            source: defaultSource || 'Import',
                            lifecycleStage: 'Lead',
                            tags: ['Imported', 'Batch-' + Math.floor(i/CHUNK_SIZE)],
                            areaCity: row.city,
                            vehicles: row.regNumber ? [{
                                regNumber: row.regNumber.toUpperCase(),
                                make: 'Unknown', model: 'Unknown', fuelType: 'Petrol'
                            }] : []
                        });
                     }
                }
            });

            // C. Insert New Customers
            if (newCustomerDocs.length > 0) {
                try {
                     // ordered: false ensures that if one doc fails (e.g. duplicate), others still get inserted
                     const createdDocs = await Customer.insertMany(newCustomerDocs, { ordered: false });
                     createdDocs.forEach(c => customerMap.set(c.mobile, c));
                } catch (err) {
                     // If some failed (e.g. duplicates), valid ones are still in err.insertedDocs (mongoose < 6) or just proceed
                     // Mongoose 6+ insertMany throws on error but returns insertedDocs in error object if ordered: false
                     if (err.insertedDocs) {
                         err.insertedDocs.forEach(c => customerMap.set(c.mobile, c));
                     }
                     // Log the error but don't crash
                     console.error('Bulk Insert Partial Error:', err.message);
                }
            }

            // D. Prepare Spokes
            const spokesToInsert = [];
            const ModelMap = {
                'workshop': WorkshopBooking,
                'sell_request': SellRequest,
                'test_drive': TestDriveBooking,
                'inspection': InspectionBooking,
                'car_requirement': CarRequirement,
                'insurance': InsurancePolicy
            };
            const TargetModel = ModelMap[importType];

            if (TargetModel) {
                 chunk.forEach(item => {
                    const customer = customerMap.get(item.mobile);
                    if (!customer) return;

                    const row = item.originalRow;
                    let spokeDoc = null;

                    if (importType === 'car_requirement') {
                        spokeDoc = {
                            customer: customer._id,
                            brand: getValue(row, ['brand', 'make']) || 'Any',
                            model: getValue(row, ['model']) || 'Any',
                            budgetMin: 0, // CSV doesn't seem to have Min Budget usually, default to 0
                            budgetMax: parseFloat(getValue(row, ['maximum budget', 'max budget', 'budget'])) || 10000000,
                            yearMin: parseInt(getValue(row, ['minimum year', 'min year', 'year', 'minimum year of registration'])) || 2015,
                            isActive: true
                        };
                    } else if (importType === 'sell_request') {
                         spokeDoc = {
                            customer: customer._id,
                            name: customer.name,
                            phoneNumber: customer.mobile,
                            location: item.city || 'Unknown',
                            registrationNumber: item.regNumber || 'Unknown',
                            brand: row.brand || row.make || 'Unknown',
                            model: row.model || 'Unknown',
                            manufactureYear: row.year || 2020,
                            kilometers: row.km || 0
                         };
                    }
                    // reuse existing logic for others (test_drive, inspection)
                    else if (importType === 'test_drive') {
                        spokeDoc = {
                           customer: customer._id,
                           name: customer.name,
                           mobileNumber: customer.mobile,
                           listingId: 'General', 
                           date: row.date || new Date().toISOString(),
                           time: row.time || '10:00 AM'
                        };
                   } else if (importType === 'inspection') {
                         spokeDoc = {
                           customer: customer._id,
                           customerName: customer.name,
                           customerPhone: customer.mobile,
                           registrationNumber: item.regNumber || 'Unknown',
                           brand: row.brand || 'Unknown',
                           model: row.model || 'Unknown',
                           year: row.year || 2020,
                           kmDriven: row.km || 0,
                           fuelType: row.fuelType || 'Petrol',
                           transmissionType: row.transmission || 'Manual',
                           appointmentDate: row.date || new Date().toISOString(),
                           appointmentTimeSlot: row.timeSlot || '09:00-11:00',
                           inspectionLocation: {
                             address: row.address || 'Unknown',
                             city: row.city || 'Ranchi',
                             pincode: row.pincode || '834001'
                           }
                         };
                   }

                    if (spokeDoc) spokesToInsert.push(spokeDoc);
                 });

                 if (spokesToInsert.length > 0) {
                    await TargetModel.insertMany(spokesToInsert);
                    results.push(...spokesToInsert.map(s => ({ status: 'Success' }))); 
                 }
            }
        }

        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            summary: {
                total: rows.length,
                imported: spokesToInsert.length, // Effectively the number of operations
                failed: errors.length,
                newCustomersCreated: newCustomerDocs.length
            },
            errors
        });

      });

  } catch (error) {
    console.error('Import error:', error);
    // Try cleanup
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (e) {}
    res.status(500).json({ success: false, error: error.message });
  }
};
/**
 * Handle chunked import via JSON body (Avoids Vercel Timeout)
 * Accepts: { rows: [], importType: string, defaultSource: string }
 */
exports.importChunk = async (req, res) => {
    try {
        const { rows, importType, defaultSource } = req.body;
        if (!rows || !Array.isArray(rows)) {
            return res.status(400).json({ success: false, error: 'Invalid data format' });
        }

        const validRows = [];
        const mobileSet = new Set();
        const errors = [];
        const results = [];

        // Helper for fuzzy match
        const getValue = (row, possibleKeys) => {
             const rowKeys = Object.keys(row);
             for (const key of possibleKeys) {
                 if (row[key]) return String(row[key]).trim(); // Trim to avoid " " duplicates
                 const foundKey = rowKeys.find(k => k.toLowerCase().replace(/[^a-z]/g, '') === key.toLowerCase());
                 if (foundKey && row[foundKey]) return String(row[foundKey]).trim();
             }
             for (const search of possibleKeys) {
                 const foundKey = rowKeys.find(k => k.toLowerCase().includes(search.toLowerCase()));
                 if (foundKey && row[foundKey]) return String(row[foundKey]).trim();
             }
             return null;
        };

        // 1. PRE-PROCESS
        for (const row of rows) {
            const rawMobile = getValue(row, ['mobile', 'phone', 'contact', 'mob', 'cell']);
            const mobile = cleanMobile(rawMobile);
            
            if (!mobile && importType !== 'insurance') {
                errors.push({ row, error: 'Missing mobile number' });
                continue;
            }

            const processed = {
                originalRow: row,
                mobile,
                name: getValue(row, ['name', 'customer', 'customername', 'fullname']) || 'Unknown',
                email: getValue(row, ['email', 'mail']) || undefined,
                regNumber: getValue(row, ['reg', 'registration', 'regno', 'vehicleno', 'numberplate']),
                city: row.city || row.address,
                rawSpokeData: row 
            };
            
            validRows.push(processed);
            if (mobile) mobileSet.add(mobile);
        }

        if (validRows.length === 0) {
             return res.json({ success: true, summary: { imported: 0, failed: errors.length }, errors });
        }

        // 2. BATCH FETCH EXISTING
        const existingCustomers = await Customer.find({ mobile: { $in: Array.from(mobileSet) } });
        const customerMap = new Map();
        existingCustomers.forEach(c => customerMap.set(c.mobile, c));

        // 3. IDENTIFY NEW
        const newCustomerDocs = [];
        const timestamp = Date.now();
        const randomBatchId = Math.floor(Math.random() * 10000);

        validRows.forEach((row, idx) => {
            if (!customerMap.has(row.mobile)) {
                 const alreadyInBatch = newCustomerDocs.find(d => d.mobile === row.mobile);
                 if (!alreadyInBatch) {
                    newCustomerDocs.push({
                        customId: `IMP-${timestamp}-${randomBatchId}-${idx}`,
                        name: row.name,
                        mobile: row.mobile,
                        email: row.email,
                        source: defaultSource || 'Import',
                        lifecycleStage: 'Lead',
                        tags: ['Imported', 'Chunked'],
                        areaCity: row.city,
                        vehicles: row.regNumber ? [{
                            regNumber: row.regNumber.toUpperCase(),
                            make: 'Unknown', model: 'Unknown', fuelType: 'Petrol'
                        }] : []
                    });
                 }
            }
        });

        // 4. INSERT NEW
        const failedMobileMap = new Map();
        
        if (newCustomerDocs.length > 0) {
            try {
                 const createdDocs = await Customer.insertMany(newCustomerDocs, { ordered: false });
                 createdDocs.forEach(c => customerMap.set(c.mobile, c));
            } catch (err) {
                 // 1. Recover successful inserts
                 if (err.insertedDocs) {
                     err.insertedDocs.forEach(c => customerMap.set(c.mobile, c));
                 }
                 
                 // 2. Map failures to specific mobiles so we can show user EXACTLY why
                 // Mongoose/BulkWriteError provides .writeErrors array with .index and .errmsg
                 if (err.writeErrors) {
                     err.writeErrors.forEach(we => {
                        const failedDoc = newCustomerDocs[we.index];
                        if (failedDoc) {
                             // Clean up error message (e.g. simplify duplicate key msg)
                             let msg = we.errmsg;
                             if (msg.includes('duplicate key')) msg = 'Duplicate Value (Email or ID already exists)';
                             failedMobileMap.set(failedDoc.mobile, msg);
                        }
                     });
                 } else {
                     console.error('Chunk Insert Error (No writeErrors):', err.message);
                 }
            }
        }

        // 5. PREPARE SPOKES
        const spokesToInsert = [];
        const ModelMap = {
            'workshop': WorkshopBooking,
            'sell_request': SellRequest,
            'test_drive': TestDriveBooking,
            'inspection': InspectionBooking,
            'car_requirement': CarRequirement,
            'insurance': InsurancePolicy
        };
        const TargetModel = ModelMap[importType];

        if (TargetModel) {
             validRows.forEach(item => {
                const customer = customerMap.get(item.mobile);
                if (!customer) {
                    const specificReason = failedMobileMap.get(item.mobile) || 'Failed to create profile (Unknown DB Error)';
                    errors.push({ row: item.originalRow, error: specificReason });
                    return;
                }

                const row = item.originalRow;
                let spokeDoc = null;

                if (importType === 'car_requirement') {
                    spokeDoc = {
                        customer: customer._id,
                        brand: getValue(row, ['brand', 'make']) || 'Any',
                        model: getValue(row, ['model']) || 'Any',
                        budgetMin: 0,
                        budgetMax: parseFloat(getValue(row, ['maximum budget', 'max budget', 'budget'])) || 10000000,
                        yearMin: parseInt(getValue(row, ['minimum year', 'min year', 'year', 'minimum year of registration'])) || 2015,
                        isActive: true
                    };
                } else if (importType === 'sell_request') {
                     spokeDoc = {
                        customer: customer._id,
                        name: customer.name,
                        phoneNumber: customer.mobile,
                        location: item.city || 'Unknown',
                        registrationNumber: item.regNumber || 'Unknown',
                        brand: getValue(row, ['brand', 'make']) || 'Unknown',
                        model: getValue(row, ['model']) || 'Unknown',
                        manufactureYear: row.year || 2020,
                        kilometers: row.km || 0
                     };
                } else if (importType === 'test_drive') {
                    spokeDoc = {
                       customer: customer._id,
                       name: customer.name,
                       mobileNumber: customer.mobile,
                       listingId: 'General', 
                       date: row.date || new Date().toISOString(),
                       time: row.time || '10:00 AM'
                    };
               } else if (importType === 'inspection') {
                     spokeDoc = {
                       customer: customer._id,
                       customerName: customer.name,
                       customerPhone: customer.mobile,
                       registrationNumber: item.regNumber || 'Unknown',
                       brand: row.brand || 'Unknown',
                       model: row.model || 'Unknown',
                       year: row.year || 2020,
                       kmDriven: row.km || 0,
                       fuelType: row.fuelType || 'Petrol',
                       transmissionType: row.transmission || 'Manual',
                       appointmentDate: row.date || new Date().toISOString(),
                       appointmentTimeSlot: row.timeSlot || '09:00-11:00',
                       inspectionLocation: {
                         address: row.address || 'Unknown',
                         city: row.city || 'Ranchi',
                         pincode: row.pincode || '834001'
                       }
                     };
               } 
               // Skipping insurance for complex reasons/limits in chunks

                if (spokeDoc) spokesToInsert.push(spokeDoc);
             });

             if (spokesToInsert.length > 0) {
                await TargetModel.insertMany(spokesToInsert);
                results.push(...spokesToInsert.map(s => ({ status: 'Success' })));
             }
        }

        res.json({
            success: true,
            summary: {
                imported: results.length,
                failed: errors.length
            },
            errors
        });

    } catch (error) {
        console.error('Import Chunk Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
// Helper
function cleanMobile(mobile) {
  if (!mobile) return null;
  return mobile.toString().replace(/\D/g, '').slice(-10);
}

// Smart Match Helper (Preserved but unused in batch mode)
async function findPotentialMatches({ mobile, vehicleReg, email }) {
    const query = { $or: [] };
    if (mobile) query.$or.push({ mobile: { $regex: mobile + '$' } });
    if (vehicleReg) query.$or.push({ "vehicles.regNumber": vehicleReg.toUpperCase() });
    if (email && email.length > 5) query.$or.push({ email: email.toLowerCase() });
    if (query.$or.length === 0) return [];
    return await Customer.find(query);
}
