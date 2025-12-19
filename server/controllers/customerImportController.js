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
 */
exports.bulkImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { importType, defaultSource } = req.body; 
    const results = [];
    const errors = [];

    // Parse CSV
    const rows = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', async () => {
        // Helper to find value case-insensitively
        const getValue = (row, possibleKeys) => {
             const rowKeys = Object.keys(row);
             for (const key of possibleKeys) {
                 // Exact match first
                 if (row[key]) return row[key];
                 // Fuzzy match
                 const foundKey = rowKeys.find(k => k.toLowerCase().replace(/[^a-z]/g, '') === key.toLowerCase());
                 if (foundKey && row[foundKey]) return row[foundKey];
             }
             // Super fuzzy: check if key *contains* the specific word (e.g. "Mobile Number" contains "mobile")
             for (const search of possibleKeys) {
                 const foundKey = rowKeys.find(k => k.toLowerCase().includes(search.toLowerCase()));
                 if (foundKey && row[foundKey]) return row[foundKey];
             }
             return null;
        };

        // Process rows
        for (const row of rows) {
          try {
            // Fuzzy lookup for Mobile
            const rawMobile = getValue(row, ['mobile', 'phone', 'contact', 'mob', 'cell']);
            const mobile = cleanMobile(rawMobile);
            


            const name = getValue(row, ['name', 'customer', 'customername', 'fullname']) || 'Unknown';
            const email = getValue(row, ['email', 'mail']) || '';
            const regNumber = getValue(row, ['reg', 'registration', 'regno', 'vehicleno', 'numberplate']);

            if (!mobile && importType !== 'insurance') { 
                // Insurance can technically import via Policy Num, but let's stick to Mobile anchor for now
                // or Reg Number.
            }

            if (!mobile) {
              errors.push({ row, error: 'Missing mobile number' });
              continue;
            }

            // 1. SMART MATCH (Find existing profile)
            // Logic ported from insuranceController
            const matches = await findPotentialMatches({ 
                mobile, 
                email, 
                vehicleReg: regNumber 
            });

            let customer;
            let needsSave = false;

            if (matches.length > 0) {
                // UPDATE / ENRICH EXISTING
                customer = matches[0];

                // A. Enrich Vehicle Data
                if (regNumber && !customer.vehicles.some(v => v.regNumber === regNumber.toUpperCase())) {
                    customer.vehicles.push({
                        regNumber: regNumber.toUpperCase(),
                        make: row.make || row.brand || 'Unknown',
                        model: row.model || 'Unknown',
                        fuelType: row.fuelType,
                        yearOfManufacture: row.year
                    });
                    needsSave = true;
                }
                
                // B. Enrich Email
                if (email && !customer.email) {
                    customer.email = email;
                    needsSave = true;
                }

                // C. Enrich Address/City
                if (row.city && !customer.areaCity) {
                    customer.areaCity = row.city;
                    needsSave = true;
                }

                if (needsSave) await customer.save();

            } else {
                // CREATE NEW HUB PROFILE
                const customId = await generateCustomId();
                customer = await Customer.create({
                    customId,
                    name,
                    mobile,
                    email: email || undefined,
                    source: defaultSource || 'Import',
                    lifecycleStage: 'Lead',
                    tags: ['Imported'],
                    areaCity: row.city || row.address,
                    vehicles: regNumber ? [{
                        regNumber: regNumber.toUpperCase(),
                        make: row.make || row.brand,
                        model: row.model,
                        fuelType: row.fuelType,
                        yearOfManufacture: row.year
                    }] : []
                });
            }

            // 2. CREATE SPOKE RECORD
            if (importType === 'workshop') {
              await WorkshopBooking.create({
                customer: customer._id,
                name: customer.name,
                mobileNumber: customer.mobile,
                carModel: row.carModel || row.model || 'Unknown',
                serviceType: row.serviceType || 'General Service',
                date: row.date || new Date().toISOString(),
                message: row.remarks || 'Imported History'
              });

            } else if (importType === 'sell_request') {
              await SellRequest.create({
                customer: customer._id,
                name: customer.name,
                phoneNumber: customer.mobile,
                location: row.location || customer.areaCity || 'Unknown',
                registrationNumber: regNumber || 'Unknown',
                brand: row.brand || row.make || 'Unknown',
                model: row.model || 'Unknown',
                manufactureYear: row.year || 2020,
                kilometers: row.km || 0
              });

            } else if (importType === 'test_drive') {
              await TestDriveBooking.create({
                 customer: customer._id,
                 name: customer.name,
                 mobileNumber: customer.mobile,
                 listingId: row.listingId || 'General',
                 date: row.date || new Date().toISOString(),
                 time: row.time || '10:00 AM'
              });

            } else if (importType === 'inspection') {
              await InspectionBooking.create({
                customer: customer._id,
                customerName: customer.name,
                customerPhone: customer.mobile,
                registrationNumber: regNumber || 'Unknown',
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
              });

            } else if (importType === 'car_requirement') {
              // SALES DEPT: Customer Requirements
              await CarRequirement.create({
                customer: customer._id,
                brand: row.brand || row.make || 'Any',
                model: row.model || 'Any',
                budgetMin: parseFloat(row.budgetMin) || 0,
                budgetMax: parseFloat(row.budgetMax) || 10000000,
                yearMin: parseInt(row.yearMin) || 2015,
                isActive: true
              });

            } else if (importType === 'insurance') {
               // Policy Import Logic
               const parseDate = (dateStr) => {
                  if (!dateStr) return null;
                  // Handle DD-MM-YYYY or DD/MM/YYYY
                  if (typeof dateStr === 'string' && /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(dateStr)) {
                      const [day, month, year] = dateStr.replace(/\//g, '-').split('-');
                      return new Date(`${year}-${month}-${day}`);
                  }
                  const d = new Date(dateStr);
                  return isNaN(d.getTime()) ? null : d;
               };

               const policyNumber = row.policyNumber || row.policy_no;
               if (!policyNumber) throw new Error('Missing Policy Number');

               // Check duplicate
               const existing = await InsurancePolicy.findOne({ policyNumber });
               if (!existing) {
                   await InsurancePolicy.create({
                        customer: customer._id,
                        policyNumber: policyNumber,
                        insurer: row.insurer || 'Unknown',
                        policyType: row.policyType,
                        source: row.source || 'Import',
                        policyStartDate: parseDate(row.policyStartDate),
                        policyEndDate: parseDate(row.expiryDate), // Critical for renewals
                        vehicle: {
                            regNumber: regNumber ? regNumber.toUpperCase() : 'UNKNOWN',
                            make: row.make,
                            model: row.model,
                            variant: row.variant,
                            year: row.year,
                            engineNumber: row.engineNo,
                            chassisNumber: row.chassisNo
                        },
                        premiumAmount: parseFloat(row.totalPremium) || 0,
                        idv: parseFloat(row.idv) || 0,
                        ncb: parseFloat(row.ncb) || 0,
                        renewalStatus: 'Pending'
                   });
               }
            }

            results.push({ mobile, status: 'Success' });
          } catch (err) {
            errors.push({ row, error: err.message });
          }
        }

        // Cleanup file
        fs.unlinkSync(req.file.path);

        res.json({
          success: true,
          summary: {
            total: rows.length,
            imported: results.length,
            failed: errors.length
          },
          errors
        });
      });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper
function cleanMobile(mobile) {
  if (!mobile) return null;
  return mobile.toString().replace(/\D/g, '').slice(-10);
}

// Smart Match Helper
async function findPotentialMatches({ mobile, vehicleReg, email }) {
    const query = { $or: [] };
    
    // 1. Mobile Match (Strongest)
    if (mobile) query.$or.push({ mobile: { $regex: mobile + '$' } });
    
    // 2. Vehicle Reg Match
    if (vehicleReg) {
        query.$or.push({ "vehicles.regNumber": vehicleReg.toUpperCase() });
    }
    
    // 3. Email Match
    if (email && email.length > 5) query.$or.push({ email: email.toLowerCase() });

    if (query.$or.length === 0) return [];

    // Return full docs (needed to update them)
    return await Customer.find(query);
}
