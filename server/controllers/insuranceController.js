const InsurancePolicy = require('../models/InsurancePolicy');
const Interaction = require('../models/Interaction');
const Customer = require('../models/Customer');
const { generateCustomId } = require('../utils/idGenerator');

// --- DASHBOARD ---

// --- DASHBOARD & ANALYTICS ---

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [expiringToday, expiringWeek, expiringMonth, expired] = await Promise.all([
      // Today (Based on policyEndDate)
      InsurancePolicy.countDocuments({ 
        renewalStatus: { $in: ['Pending', 'InProgress'] }, 
        policyEndDate: { $gte: today, $lt: tomorrow } 
      }),
      // This Week
      InsurancePolicy.countDocuments({ 
        renewalStatus: { $in: ['Pending', 'InProgress'] }, 
        policyEndDate: { $gte: today, $lt: nextWeek } 
      }),
      // This Month
      InsurancePolicy.countDocuments({ 
        renewalStatus: { $in: ['Pending', 'InProgress'] }, 
        policyEndDate: { $gte: startOfMonth, $lte: endOfMonth } 
      }),
      // Expired (Past date and NOT renewed)
      InsurancePolicy.countDocuments({ 
        renewalStatus: { $in: ['Pending', 'InProgress'] }, 
        policyEndDate: { $lt: today } 
      })
    ]);

    res.json({ expiringToday, expiringWeek, expiringMonth, expired });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

exports.getAnalytics = async (req, res) => {
    try {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Overall Stats
        const totalRevenueResult = await InsurancePolicy.aggregate([
            { $match: { renewalStatus: 'Renewed', policyStartDate: { $gte: startOfYear } } },
            { $group: { _id: null, total: { $sum: "$totalPremiumPaid" }, count: { $sum: 1 } } }
        ]);
        
        const monthlyRevenueResult = await InsurancePolicy.aggregate([
             { $match: { renewalStatus: 'Renewed', policyStartDate: { $gte: startOfMonth } } },
             { $group: { _id: null, total: { $sum: "$totalPremiumPaid" } } }
        ]);

        // 2. Revenue Trend (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const revenueTrend = await InsurancePolicy.aggregate([
            { $match: { renewalStatus: 'Renewed', policyStartDate: { $gte: sixMonthsAgo } } },
            { $group: { 
                _id: { $month: "$policyStartDate" }, 
                revenue: { $sum: "$totalPremiumPaid" },
                count: { $sum: 1 }
            }},
            { $sort: { "_id": 1 } }
        ]);

        // 3. Conversion Rate (Based on Expiry Date in current month)
        // Expired in current month vs Renewed in current month (Approximation)
        // Better: Policies Expiring this month -> Status check
        const conversionStats = await InsurancePolicy.aggregate([
            { $match: { policyEndDate: { $gte: startOfMonth } } },
            { $group: { 
                _id: "$renewalStatus", 
                count: { $sum: 1 } 
            }}
        ]);

        // 4. Agent Performance (From Interactions or Assignment?)
        // Let's use Assigned Agent on Closed Policies
        const agentPerformance = await InsurancePolicy.aggregate([
            { $match: { renewalStatus: 'Renewed', policyStartDate: { $gte: startOfYear } } },
            { $group: {
                _id: "$assignedAgent",
                revenue: { $sum: "$totalPremiumPaid" },
                policiesSold: { $sum: 1 }
            }},
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
            { $unwind: { path: "$agent", preserveNullAndEmptyArrays: true } },
            { $project: { name: "$agent.name", revenue: 1, policiesSold: 1 } }
        ]);

        res.json({
            totalRevenue: totalRevenueResult[0]?.total || 0,
            monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
            revenueTrend,
            conversionStats,
            agentPerformance
        });

    } catch (error) {
        console.error("Analytics Error", error);
        res.status(500).json({ message: 'Error loading analytics' });
    }
}

// --- POLICIES ---

exports.getPolicies = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      filter = 'all', 
      bucket, // New param: 'upcoming_month', '15_days', '7_days', 'overdue'
      search,
    } = req.query;

    const query = {};
    const today = new Date();
    today.setHours(0,0,0,0);

    // --- BUCKET LOGIC (Priority Timeline) ---
    if (bucket) {
        query.renewalStatus = { $in: ['Pending', 'InProgress', 'NotInterested'] }; // Exclude Renewed/Lost? Or keep NotInterested? 
        // Logic: We want to work on Pending stuff.
        
        if (bucket === 'upcoming_month') {
            // Policies expiring next month (e.g. if Dec, then Jan 1 - Jan 31)
            // Or roughly 30 days out? User said "1 month prior".
            // Let's do: Start of Next Month to End of Next Month? 
            // Or simply: Expiry > Today + 25 days?
            // "If Jan expiry, start Dec end". So Next Month logic is best.
            const currentMonth = today.getMonth();
            const nextMonthStart = new Date(today.getFullYear(), currentMonth + 1, 1);
            const nextMonthEnd = new Date(today.getFullYear(), currentMonth + 2, 0);
            query.policyEndDate = { $gte: nextMonthStart, $lte: nextMonthEnd };
        
        } else if (bucket === '15_days') {
            // Expiring in 8 to 20 days? 
            const start = new Date(today); start.setDate(start.getDate() + 8);
            const end = new Date(today); end.setDate(end.getDate() + 21);
            query.policyEndDate = { $gte: start, $lte: end };
            
        } else if (bucket === '7_days') {
            // Expiring in 0 to 7 days
            const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
            query.policyEndDate = { $gte: today, $lte: nextWeek };
            
        } else if (bucket === 'overdue') {
            // Expired in last 30 days
            const lastMonth = new Date(today); lastMonth.setDate(lastMonth.getDate() - 30);
            query.policyEndDate = { $lt: today, $gte: lastMonth };
        }
    }

    // Existing Filters (Backward Compat)
    if (filter === 'today') {
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        query.renewalStatus = { $in: ['Pending', 'InProgress'] };
        query.policyEndDate = { $gte: today, $lt: tomorrow };
    } else if (filter === 'week') {
        const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
        query.renewalStatus = { $in: ['Pending', 'InProgress'] };
        query.policyEndDate = { $gte: today, $lt: nextWeek };
    } else if (filter === 'expired') {
        query.renewalStatus = { $in: ['Pending', 'InProgress'] };
        query.policyEndDate = { $lt: today };
    } else if (filter === 'renewed') {
        query.renewalStatus = 'Renewed';
    } else if (filter === 'my_followups') {
        if (req.user) query.assignedAgent = req.user._id;
        query.nextFollowUpDate = { $lte: today, $ne: null };
        query.renewalStatus = { $in: ['Pending', 'InProgress'] };
    }

    // Search Logic
    if (search) {
        const regex = new RegExp(search, 'i');
        const customers = await Customer.find({
            $or: [{ name: regex }, { mobile: regex }, { 'vehicles.regNumber': regex }]
        }).select('_id');
        
        const customerIds = customers.map(c => c._id);
        delete query.assignedAgent; 
        
        if (Object.keys(query).length > 0) {
             query.$and = [
                 { $or: [
                     { customer: { $in: customerIds } },
                     { policyNumber: regex },
                     { 'vehicle.regNumber': regex }
                 ]}
             ];
        } else {
             query.$or = [
                 { customer: { $in: customerIds } },
                 { policyNumber: regex },
                 { 'vehicle.regNumber': regex }
             ];
        }
    }

    const policies = await InsurancePolicy.find(query)
      .populate('customer', 'name mobile customId vehicles')
      .populate('assignedAgent', 'name')
      .sort({ policyEndDate: 1 }) 
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await InsurancePolicy.countDocuments(query);

    res.json({
      policies,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalPolicies: total
    });
  } catch (error) {
    console.error('Get policies error:', error);
    res.status(500).json({ message: 'Error fetching policies' });
  }
};

exports.createPolicy = async (req, res) => {
  try {
    const { 
      // Customer Data (for matching/creation)
      customerMobile, customerName, customerEmail,
      // Policy Data
      policyNumber, insurer, expiryDate, previousIDV, premiumAmount, coverageType,
      // Vehicle Data
      regNumber, make, model, year,
      // Metadata
      existingCustomerId 
    } = req.body;

    let customerId = existingCustomerId;

    // 1. If no ID provided, try to find or create customer
    if (!customerId) {
        // Search by mobile
        let customer = await Customer.findOne({ 
            $or: [{ mobile: customerMobile }, { alternatePhones: customerMobile }]
        });

        if (!customer) {
            // Create NEW Customer
            const customId = await generateCustomId();
            customer = new Customer({
                customId,
                name: customerName,
                mobile: customerMobile,
                email: customerEmail,
                vehicles: [{ regNumber, make, model, year }]
            });
            await customer.save();
        } else {
            // Update existing customer? (Maybe add regNumber if not exists)
            // Implementation choice: For now, just link.
            // Check if vehicle exists in profile, if not add it?
            const vehicleExists = customer.vehicles?.some(v => v.regNumber === regNumber);
            if (!vehicleExists) {
                customer.vehicles.push({ regNumber, make, model, year });
                await customer.save();
            }
        }
        customerId = customer._id;
    }

    // 2. Create Policy
    const policy = new InsurancePolicy({
        customer: customerId,
        policyNumber,
        insurer,
        policyEndDate: expiryDate, // Mapped from form expiryDate
        premiumAmount,
        idv: previousIDV,
        coverageType,
        vehicle: { regNumber, make, model, year }
    });

    await policy.save();

    res.status(201).json({ message: 'Policy created', policy });

  } catch (error) {
    console.error('Create policy error:', error);
    res.status(500).json({ message: 'Error creating policy' });
  }
};

exports.updatePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const policy = await InsurancePolicy.findByIdAndUpdate(id, updates, { new: true });
        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: 'Error updating policy' });
    }
};

// --- WORKFLOW ACTIONS ---

exports.renewPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const { insurer, premium, idv, paymentDate, renewalDate } = req.body;

        const policy = await InsurancePolicy.findById(id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });

        // Update status and details
        policy.renewalStatus = 'Renewed';
        policy.insurerAfterRenewal = insurer;
        policy.idvAfterRenewal = idv;
        policy.renewalDate = renewalDate || new Date();
        
        // Optionally, we could create a NEW policy document for the next year
        // But for simplicity in this version, we mark this as Renewed.
        // Or better: Create a new Policy for the next year and link them? 
        // For now, based on schema, it seems we just track renewal on the same doc or create new.
        // Let's create a NEW policy for the new period and mark old as Renewed.
        
        // 1. Mark Old as Renewed
        // policy.renewalStatus = 'Renewed'; // Already done above
        await policy.save();

        // 2. Create New Policy (Next Year)
        const newStartDate = new Date(policy.policyEndDate);
        newStartDate.setDate(newStartDate.getDate() + 1);
        const newEndDate = new Date(newStartDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        newEndDate.setDate(newEndDate.getDate() - 1);

        const newPolicy = new InsurancePolicy({
             customer: policy.customer,
             assignedAgent: req.user._id, // Assign to whoever renewed it
             policyNumber: "RENEW-" + Math.floor(1000 + Math.random() * 9000), // Placeholder if not provided
             insurer: insurer || policy.insurer,
             policyType: policy.policyType,
             source: 'Renewal',
             policyStartDate: newStartDate,
             policyEndDate: newEndDate,
             vehicle: policy.vehicle,
             premiumAmount: premium,
             idv: idv,
             renewalStatus: 'Pending'
        });
        
        await newPolicy.save();

        res.json({ message: 'Policy renewed', oldPolicy: policy, newPolicy });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error renewing policy' });
    }
};

exports.markLost = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, remark } = req.body;

        const policy = await InsurancePolicy.findByIdAndUpdate(id, {
            renewalStatus: 'Lost',
            lostCaseReason: reason,
            lastRemark: remark
        }, { new: true });

        res.json(policy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error marking policy as lost' });
    }
};


exports.addInteraction = async (req, res) => {
    try {
        const { customerId, remark, nextFollowUp, agentName } = req.body;
        
        const interaction = new Interaction({
            customer: customerId,
            type: 'insurance_followup',
            agentName: agentName || 'Admin', // Should come from req.user
            data: {
                remark,
                nextFollowUp
            }
        });

        await interaction.save();
        res.status(201).json(interaction);

    } catch (error) {
        res.status(500).json({ message: 'Error adding interaction' });
    }
};

exports.getInteractions = async (req, res) => {
    try {
        const { customerId } = req.params;
        const interactions = await Interaction.find({ customer: customerId })
            .sort({ date: -1 });
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching interactions' });
    }
};

// --- BULK IMPORT ---

const { findPotentialMatches } = require('../utils/customerMatcher');

exports.importPolicies = async (req, res) => {
    try {
        const { policies, preview = false } = req.body; // Expects array directly now, or { policies, preview }
        
        // Normalize input if just array passed
        const rows = Array.isArray(req.body) ? req.body : policies;

        if (!rows || !Array.isArray(rows)) {
            return res.status(400).json({ message: 'Invalid data format. Expected array of policies.' });
        }

        const results = {
            total: rows.length,
            success: 0,
            failed: 0,
            skipped: 0,
            errors: [], // { row: 1, error: '...' }
            previewData: [] // For UI confirmation
        };

        // --- PREVIEW MODE ---
        if (preview) {
            // Check for existing policy numbers in one go (optimization)
            const policyNumbers = rows.map(r => r.policyNumber).filter(Boolean);
            const existingPolicies = await InsurancePolicy.find({ policyNumber: { $in: policyNumbers } }).select('policyNumber');
            const existingSet = new Set(existingPolicies.map(p => p.policyNumber));

            results.previewData = rows.map((row, index) => {
                let status = 'Valid';
                let valid = true;
                let reason = '';

                // Simple validations
                if (!row.policyNumber) { status = 'Error'; reason = 'Missing Policy Number'; valid = false; }
                if (!row.mobile) { status = 'Error'; reason = 'Missing Mobile'; valid = false; }
                if (existingSet.has(row.policyNumber)) { valid = false; reason = 'Policy already exists'; }

                return {
                    row: index + 1,
                    customer: row.customerName,
                    policyNumber: row.policyNumber,
                    status: valid ? 'Ready' : 'Skip',
                    reason
                };
            });

            return res.json({ message: 'Preview generated', results });
        }

        // --- COMMIT MODE ---
        // Optimization: Fetch all potential duplicates upfront? Hard for Customers.
        // We will process sequentially for safety, or batch if slow. Sequential is fine for 5-7k for now if timeout is high.

        for (const [index, row] of rows.entries()) {
            try {
                // 1. Validation & Skip
                if (!row.policyNumber || !row.mobile) {
                    results.failed++;
                    results.errors.push(`Row ${index + 1}: Missing mandatory fields`);
                    continue;
                }

                const existingPolicy = await InsurancePolicy.findOne({ policyNumber: row.policyNumber });
                if (existingPolicy) {
                    results.skipped++;
                    continue; // Skip duplicates silently or log
                }

                // 2. Find or Create Customer (Smart Match)
                let customer;
                
                // Matches returns array. We take best match (first one usually).
                // Or we trust "mobile" as unique key if our matcher is strict.
                const matches = await findPotentialMatches({
                    mobile: row.mobile,
                    vehicleReg: row.regNumber,
                    email: row.email,
                    name: row.customerName // For fuzzy logic if we added it
                });

                if (matches.length > 0) {
                    // LINK to Existing
                    customer = await Customer.findById(matches[0]._id);
                    
                    // Update vehicle list if new reg
                    if (row.regNumber && !customer.vehicles.some(v => v.regNumber === row.regNumber.toUpperCase())) {
                        customer.vehicles.push({
                            regNumber: row.regNumber.toUpperCase(),
                            make: row.make,
                            model: row.model,
                            variant: row.variant,
                            fuelType: row.fuelType,
                            yearOfManufacture: row.yearOfManufacture,
                            registrationDate: row.registrationDate ? new Date(row.registrationDate) : null
                        });
                        await customer.save();
                    }
                    
                    // Update stats/city if missing
                    if (!customer.areaCity && row.areaCity) {
                        customer.areaCity = row.areaCity;
                        await customer.save();
                    }

                } else {
                    // CREATE New
                    const customId = await generateCustomId();
                    customer = new Customer({
                        customId,
                        name: row.customerName || 'Unknown',
                        mobile: row.mobile,
                        email: row.email,
                        areaCity: row.areaCity,
                        vehicles: row.regNumber ? [{
                            regNumber: row.regNumber.toUpperCase(),
                            make: row.make,
                            model: row.model,
                            variant: row.variant,
                            fuelType: row.fuelType,
                            yearOfManufacture: row.yearOfManufacture,
                            registrationDate: row.registrationDate ? new Date(row.registrationDate) : null
                        }] : []
                    });
                    await customer.save();
                }

                // 3. Create Policy
                // Parse Dates safely
                const pEndDate = row.expiryDate ? new Date(row.expiryDate) : null;
                const pStartDate = row.policyStartDate ? new Date(row.policyStartDate) : null;
                
                // Determine status based on end date
                const isExpired = pEndDate && pEndDate < new Date();

                const policy = new InsurancePolicy({
                    customer: customer._id,
                    policyNumber: row.policyNumber,
                    insurer: row.insurer || 'Unknown',
                    policyType: row.policyType,
                    source: row.source || 'Import',
                    
                    policyStartDate: pStartDate,
                    policyEndDate: pEndDate, // Crucial
                    
                    vehicle: {
                        regNumber: row.regNumber ? row.regNumber.toUpperCase() : 'UNKNOWN',
                        make: row.make,
                        model: row.model,
                        variant: row.variant,
                        year: row.year,
                        chassisNumber: row.chassisNo,
                        engineNumber: row.engineNo
                    },

                    premiumAmount: parseFloat(row.totalPremiumPaid) || parseFloat(row.premiumAmount) || 0,
                    ownDamagePremium: parseFloat(row.ownDamagePremium) || 0,
                    tpPremium: parseFloat(row.tpPremium) || 0,
                    addonPremium: parseFloat(row.addonPremium) || 0,
                    totalPremiumPaid: parseFloat(row.totalPremiumPaid) || 0,
                    idv: parseFloat(row.idvCurrent) || 0,
                    ncb: parseFloat(row.ncb) || 0,
                    currentAddons: row.currentAddons ? row.currentAddons.split(',').map(s=>s.trim()) : [],

                    renewalStatus: isExpired ? 'Pending' : 'Pending', // Everything imported starts as Pending renewal unless specified?
                    // Actually if it is expired, it IS pending renewal. If active, it will become pending.
                });

                await policy.save();
                results.success++;

                // Optional: Log Import Interaction? 
                // Might be too noisy for 7000 rows. Skip for now.

            } catch (err) {
                results.failed++;
                results.errors.push(`Row ${index + 1} (${row.policyNumber}): ${err.message}`);
                console.error(err);
            }
        }

        res.json({ message: 'Import processed', results });

    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ message: 'Server error during import' });
    }
    }

// --- WORKFLOW ACTIONS ---
exports.logWorkflowAction = async (req, res) => {
    try {
        const { id } = req.params;
        const { actionType, outcome, remark, nextFollowUp } = req.body;
        
        const policy = await InsurancePolicy.findById(id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });

        // 1. Determine New Stage based on Outcome
        let newStage = policy.renewalStage;
        let newStatus = policy.renewalStatus;
        
        if (outcome.includes('Quote Sent')) {
            newStage = 'QuoteSent';
            newStatus = 'InProgress';
        } else if (outcome.includes('Connected')) {
            newStage = 'Contacted';
            newStatus = 'InProgress';
        } else if (outcome.includes('Not Interested')) {
            newStatus = 'NotInterested'; // Or Lost?
        } else if (outcome.includes('Wrong Number')) {
            // maybe flag customer?
        }

        // 2. Update Policy
        policy.lastInteractionDate = new Date();
        policy.lastRemark = remark;
        if (nextFollowUp) policy.nextFollowUpDate = nextFollowUp;
        if (newStage) policy.renewalStage = newStage;
        if (newStatus) policy.renewalStatus = newStatus;
        
        // Add to nextActions history if needed, or just clear pending
        // For now, simple update
        await policy.save();

        // 3. Log Interaction
        // We need customer ID. Policy has it.
        const Interaction = require('../models/Interaction'); // Ensure import
        const interaction = new Interaction({
            customer: policy.customer,
            policy: policy._id,
            type: 'insurance_followup',
            agentName: (req.user && req.user.name) || 'Lead Agent', // Fallback as JWT might not have name
            agentId: req.user ? req.user.id : null, // req.user.id from JWT payload
            data: {
                remark: `${actionType.toUpperCase()}: ${remark}`,
                outcome,
                nextFollowUpDate: nextFollowUp,
                statusAfter: newStatus
            }
        });
        await interaction.save();

        res.json({ message: 'Action logged', policy });

    } catch (error) {
        console.error('Log Action Error:', error);
        res.status(500).json({ message: 'Error logging action' });
    }
};
