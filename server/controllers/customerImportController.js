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
                            customId: 'IMP-' + Date.now() + '-' + (i + idxInChunk),
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
                const createdDocs = await Customer.insertMany(newCustomerDocs);
                createdDocs.forEach(c => customerMap.set(c.mobile, c));
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
                            brand: row.brand || row.make || 'Any',
                            model: row.model || 'Any',
                            budgetMin: parseFloat(row.budgetMin) || 0,
                            budgetMax: parseFloat(row.budgetMax) || 10000000,
                            yearMin: parseInt(row.yearMin) || 2015,
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
