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

    // DEBUG LOGS
    console.log('--- DASHBOARD STATS DEBUG ---');
    console.log('Today:', today);
    console.log('StartMonth:', startOfMonth, 'EndMonth:', endOfMonth);

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

    console.log('Stats Found:', { expiringToday, expiringWeek, expiringMonth, expired });
    
    // Check strict match for debugging if counts are 0
    if (expired === 0) {
         const quickCheck = await InsurancePolicy.find({ policyEndDate: { $lt: today } }).limit(2).select('policyEndDate renewalStatus');
         console.log('Sample Expired policies (ignoring status?):', quickCheck);
    }

    res.json({ expiringToday, expiringWeek, expiringMonth, expired });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

exports.getPolicyCounts = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const [todayCount, tomorrowCount, renewedMonthCount, lostMonthCount] = await Promise.all([
             // Today
             InsurancePolicy.countDocuments({ 
                policyEndDate: { $gte: today, $lt: tomorrow },
                renewalStatus: { $in: ['Pending', 'InProgress', 'NotInterested'] } // Matching Bucket Logic
             }),
             // Tomorrow
             InsurancePolicy.countDocuments({ 
                policyEndDate: { $gte: tomorrow, $lt: endOfTomorrow },
                renewalStatus: { $in: ['Pending', 'InProgress', 'NotInterested'] }
             }),
             // Renewed This Month
             InsurancePolicy.countDocuments({ 
                renewalStatus: 'Renewed',
                $or: [
                    { renewalDate: { $gte: startOfMonth, $lte: endOfMonth } },
                    { updatedAt: { $gte: startOfMonth, $lte: endOfMonth } }
                ]
             }),
             // Lost This Month
             InsurancePolicy.countDocuments({ 
                renewalStatus: { $in: ['Lost', 'NotInterested'] },
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
             })
        ]);

        res.json({
            today: todayCount,
            tomorrow: tomorrowCount,
            renewed_month: renewedMonthCount,
            lost_month: lostMonthCount
        });
    } catch (error) {
        console.error('Error fetching policy counts:', error);
        res.status(500).json({ message: 'Error fetching counts' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Date Range Logic
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Default: Start of Month
        const end = endDate ? new Date(endDate) : new Date(); // Default: Now
        end.setHours(23, 59, 59, 999); // End of the day

        console.log(`Analytics Range: ${start.toISOString()} to ${end.toISOString()}`);

        // 1. Agent Activity (Interactions)
        // Count Calls, WhatsApps, Remarks logged by each agent
        const agentActivity = await Interaction.aggregate([
            { 
                $match: { 
                    date: { $gte: start, $lte: end },
                    agentId: { $exists: true }
                } 
            },
            {
                $group: {
                    _id: "$agentId",
                    calls: { 
                        $sum: { $cond: [{ $eq: ["$type", "Call"] }, 1, 0] }
                    },
                    whatsapp: { 
                        $sum: { $cond: [{ $eq: ["$type", "WhatsApp"] }, 1, 0] }
                    },
                    remarks: { 
                        $sum: { $cond: [{ $eq: ["$type", "Remark"] }, 1, 0] } // Or general
                    },
                    totalInteractions: { $sum: 1 }
                }
            },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
            { $unwind: { path: "$agent", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    name: "$agent.name",
                    email: "$agent.email",
                    calls: 1,
                    whatsapp: 1,
                    totalInteractions: 1
                }
            }
        ]);

        // 2. Conversion/Sales Performance
        // Policies Renewed by Agent in this period
        const conversionStats = await InsurancePolicy.aggregate([
            { 
                $match: { 
                    renewalStatus: 'Renewed',
                    renewalDate: { $gte: start, $lte: end } // Use exact renewal date
                } 
            },
            {
                $group: {
                    _id: "$assignedAgent",
                    policiesSold: { $sum: 1 },
                    totalPremium: { $sum: "$totalPremiumPaid" },
                    revenue: { $sum: "$commissionAmount" } // Actual earnings
                }
            },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
            { $unwind: { path: "$agent", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    name: "$agent.name",
                    email: "$agent.email",
                    policiesSold: 1,
                    totalPremium: 1
                }
            }
        ]);
        
        // 3. Follow-ups Taken (Explicit 'insurance_followup' type)
        // This overlaps with 'calls' if logged as such, but let's count specifically if type is set
        const followupsTaken = await Interaction.countDocuments({
             date: { $gte: start, $lte: end },
             type: 'insurance_followup'
        });

        res.json({
            meta: { start, end },
            agentActivity,
            conversionStats,
            summary: {
                totalInteractions: agentActivity.reduce((acc, curr) => acc + curr.totalInteractions, 0),
                policiesRenewed: conversionStats.reduce((acc, curr) => acc + curr.policiesSold, 0),
                totalPremium: conversionStats.reduce((acc, curr) => acc + curr.totalPremium, 0)
            }
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
      sort, // New: 'expiry_asc', 'expiry_desc'
    } = req.query;

    const query = {};
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Sort Logic
    let sortOptions = { policyEndDate: 1 }; // Default: Oldest First (Expiring soonest)
    if (sort === 'expiry_desc') sortOptions = { policyEndDate: -1 };
    if (sort === 'expiry_asc') sortOptions = { policyEndDate: 1 };

    // --- DEBUG ---
    console.log('GET /policies Params:', { page, limit, filter, bucket, search });

    // --- BUCKET LOGIC (Priority Timeline) ---
    // Ensure bucket is a valid string and not 'null' or 'undefined'
    // --- BUCKET LOGIC (Priority Timeline) ---
    // Ensure bucket is a valid string
    if (bucket && bucket !== 'null' && bucket !== 'undefined' && bucket !== '') {
        
        // Special Bucket: Needs Fix (Invalid Dates)
        if (bucket === 'needs_fix') {
            query.$or = [
                { policyEndDate: null }, 
                { dataQuality: { $in: ['InvalidEndDate', 'MissingEndDate'] } }
            ];
            // Don't filter by renewalStatus strictly here, we want to fix ALL of them
        } else {
            // STANDARD BUCKETS: Must have valid dates
            query.policyEndDate = { $ne: null }; 
            // Allow OK or undefined (legacy)
            query.$or = [
                { dataQuality: 'OK' }, 
                { dataQuality: { $exists: false } }, 
                { dataQuality: null }
            ];
            
            // Status: General 'all' active view should exclude Renewed and Lost
            // But if user wants to see 'renewed' in buckets, we might need a separate toggle.
            // For now, default to Active (Pending/InProgress/NotInterested) as per request.
            query.renewalStatus = { $in: ['Pending', 'InProgress', 'NotInterested'] }; 

            if (bucket === 'upcoming_month') {
                const currentMonth = today.getMonth();
                const nextMonthStart = new Date(today.getFullYear(), currentMonth + 1, 1);
                const nextMonthEnd = new Date(today.getFullYear(), currentMonth + 2, 0);
                query.policyEndDate = { $gte: nextMonthStart, $lte: nextMonthEnd };
            
            } else if (bucket === '15_days') {
                const start = new Date(today); start.setDate(start.getDate() + 8);
                const end = new Date(today); end.setDate(end.getDate() + 21);
                query.policyEndDate = { $gte: start, $lte: end };
                
            } else if (bucket === '7_days') {
                const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
                query.policyEndDate = { $gte: today, $lte: nextWeek };

            } else if (bucket === 'today') {
                const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
                query.policyEndDate = { $gte: today, $lt: tomorrow };
            
            } else if (bucket === 'tomorrow') {
                const start = new Date(today); start.setDate(start.getDate() + 1);
                const end = new Date(today); end.setDate(end.getDate() + 2);
                query.policyEndDate = { $gte: start, $lt: end };

            } else if (bucket === 'overdue') {
                const lastMonth = new Date(today); lastMonth.setDate(lastMonth.getDate() - 30);
                query.policyEndDate = { $lt: today, $gte: lastMonth };
            
            } else if (bucket === 'expired_all') {
                // Older than 30 days
                const lastMonth = new Date(today); lastMonth.setDate(lastMonth.getDate() - 30);
                query.policyEndDate = { $lt: lastMonth };
            }
        }
    }

    // Existing Filters & New Requests
    if (filter === 'followups_today') {
        // "Follow-ups Pending/Due Today"
        if (req.user) query.assignedAgent = req.user._id; // My followups
        const startOfDay = new Date(today.setHours(0,0,0,0));
        const endOfDay = new Date(today.setHours(23,59,59,999));
        query.nextFollowUpDate = { $gte: startOfDay, $lte: endOfDay };
    }

    if (filter === 'followups_overdue') {
        // "Missed Follow-ups"
        if (req.user) query.assignedAgent = req.user._id;
        query.nextFollowUpDate = { $lt: new Date() }; // In the past
        query.renewalStatus = { $nin: ['Renewed', 'Lost', 'NotInterested'] }; // Still active
    }

    if (filter === 'followups_done_today') {
        // "Track what agent has done today"
        // Based on lastInteractionDate being >= today start
        if (req.user) query.assignedAgent = req.user._id;
        query.lastInteractionDate = { $gte: today };
    } else if (filter === 'renewed_month') {
        // Renewed in current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        query.renewalStatus = 'Renewed';
        // We can use renewalDate if it exists, else updatedAt or policyStartDate
        query.$or = [
            { renewalDate: { $gte: startOfMonth, $lte: endOfMonth } },
            { updatedAt: { $gte: startOfMonth, $lte: endOfMonth } } // Fallback
        ];
    } else if (filter === 'lost_month') {
        // Lost in current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        query.renewalStatus = { $in: ['Lost', 'NotInterested'] };
        query.updatedAt = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (filter === 'my_policies') {
        if (req.user) query.assignedAgent = req.user._id;
    } else if (filter === 'needs_fix') {
         query.$or = [
                { policyEndDate: null }, 
                { dataQuality: { $in: ['InvalidEndDate', 'MissingEndDate'] } }
         ];
    }

    // Search Logic (Preserve existing regex logic)
    if (search) {
        // ... (keep search logic below)
        const regex = new RegExp(search, 'i');
        const customers = await Customer.find({
            $or: [{ name: regex }, { mobile: regex }, { 'vehicles.regNumber': regex }]
        }).select('_id');
        
        const customerIds = customers.map(c => c._id);
        delete query.assignedAgent; // Allow global search? Or keep restricted? 
        delete query.nextFollowUpDate; // Search overrides filters usually
        
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
      .sort(sortOptions) 
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
    
    // Default Assignment: Admin
    const User = require('../models/User'); // Ensure User model is imported or available
    let assignedTo = null;
    if (req.user && req.user.role === 'insurance_agent') {
        assignedTo = req.user._id;
    } else {
        const adminUser = await User.findOne({ email: 'admin@poddarmotors.com' });
        assignedTo = adminUser ? adminUser._id : req.user?._id; 
    }

    const policy = new InsurancePolicy({
        customer: customerId,
        assignedAgent: assignedTo, // Default Assignment
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
        
        // Sanitize Dates
        if (updates.policyEndDate === '') updates.policyEndDate = null;
        if (updates.nextFollowUpDate === '') updates.nextFollowUpDate = null;
        if (updates.policyStartDate === '') updates.policyStartDate = null;

        const policy = await InsurancePolicy.findByIdAndUpdate(id, updates, { new: true });

        // SYNC: Vehicle details to Customer
        if (policy.customer && policy.vehicle && policy.vehicle.regNumber) {
             const customer = await Customer.findById(policy.customer);
             if (customer) {
                 const vehicleIndex = customer.vehicles.findIndex(v => v.regNumber === policy.vehicle.regNumber);
                 if (vehicleIndex > -1) {
                     // Update existing
                     customer.vehicles[vehicleIndex].make = policy.vehicle.make || customer.vehicles[vehicleIndex].make;
                     customer.vehicles[vehicleIndex].model = policy.vehicle.model || customer.vehicles[vehicleIndex].model;
                     customer.vehicles[vehicleIndex].yearOfManufacture = policy.vehicle.year || customer.vehicles[vehicleIndex].yearOfManufacture;
                     await customer.save();
                 }
             }
        }

        res.json(policy);
    } catch (error) {
        console.error('Update Policy Error:', error);
        res.status(500).json({ message: 'Error updating policy', error: error.message });
    }
};

exports.deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await InsurancePolicy.findByIdAndDelete(id);

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        res.json({ message: 'Policy deleted successfully' });
    } catch (error) {
        console.error('Delete Policy Error:', error);
        res.status(500).json({ message: 'Error deleting policy', error: error.message });
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
        const userId = req.user ? req.user._id : null;
        const userName = req.user ? req.user.name : 'Unknown';

        const policy = await InsurancePolicy.findByIdAndUpdate(id, {
            renewalStatus: 'Lost',
            lostCaseReason: reason,
            lastRemark: remark
        }, { new: true });

        // LOG INTERACTION (Consistency)
        if (policy) {
            // 1. Embedded
            policy.interactions.push({
                type: 'status_change',
                outcome: 'Lost',
                remark: `Marked as Lost. Reason: ${reason}. Remark: ${remark}`,
                createdBy: userId
            });
            await policy.save();

            // 2. Global
            await Interaction.create({
                customer: policy.customer,
                policy: policy._id,
                type: 'status_change',
                agentName: userName,
                agentId: userId,
                data: {
                    outcome: 'Lost',
                    remark: remark,
                    statusAfter: 'Lost'
                }
            });

            // 3. CUSTOMER 360 SYNC
            const noteContent = `[Insurance LOST] Status: Lost \nReason: ${reason} \nRemark: ${remark}`;
            await Customer.findByIdAndUpdate(policy.customer, {
                $push: {
                    notes: {
                        content: noteContent,
                        addedBy: userId,
                        createdAt: new Date()
                    }
                }
            });

        }

        res.json(policy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error marking policy as lost' });
    }
};


exports.addInteraction = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, outcome, remark, nextFollowUpDate, lostReason } = req.body;
        const userId = req.user ? req.user._id : null;

        const policy = await InsurancePolicy.findById(id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });

        // Push Interaction
        policy.interactions.push({
            type: type || 'Other',
            outcome,
            remark,
            nextFollowUpDate,
            createdBy: userId
        });

        // Update Top-level fields
        policy.lastInteractionDate = new Date();
        policy.lastRemark = remark;
        if (nextFollowUpDate) {
            policy.nextFollowUpDate = nextFollowUpDate;
        }

        // Auto-Mapping Logic
        // 1. Stage Mapping
        const outcomeToStage = {
            'Contacted': 'Contacted',
            'QuoteSent': 'QuoteSent',
            'Negotiation': 'Negotiation',
            'Accepted': 'Accepted',
            'PaymentLinkSent': 'PaymentPending',
            'PaymentReceived': 'PaymentReceived',
            'PolicyIssued': 'PolicyIssued'
        };
        if (outcomeToStage[outcome]) {
            policy.renewalStage = outcomeToStage[outcome];
        } else if (outcome === 'CallbackLater') {
            policy.renewalStage = 'FollowUp';
        }

        // 1b. Reminder Status Update (New)
        if (req.body.reminderStatus) {
            policy.reminderStatus = req.body.reminderStatus;
        } else if (outcome === '30DayReminder') { // Fallback if derived from outcome
             policy.reminderStatus = '30Day';
        } else if (outcome === '15DayReminder') {
             policy.reminderStatus = '15Day';
        } else if (outcome === '7DayReminder') {
             policy.reminderStatus = '7Day';
        }

        // 2. Status Mapping
        if (['Contacted', 'QuoteSent', 'Negotiation', 'Accepted', 'CallbackLater', 'PaymentLinkSent'].includes(outcome)) {
            if (policy.renewalStatus === 'Pending') policy.renewalStatus = 'InProgress';
        } else if (outcome === 'NotInterested') {
            policy.renewalStatus = 'NotInterested';
            if (lostReason) policy.lostReason = lostReason;
        } else if (outcome === 'RenewedElsewhere') {
            policy.renewalStatus = 'Lost';
            policy.lostReason = 'RenewedElsewhere';
        }

        await policy.save();

        // 3. Global Interaction (Dual Write)
        try {
            await Interaction.create({
                customer: policy.customer,
                policy: policy._id,
                type: type === 'Call' ? 'insurance_followup' : 'general', // Map to Interaction schema enums
                agentName: req.user ? req.user.name : 'System',
                agentId: userId,
                data: {
                    remark,
                    outcome,
                    nextFollowUpDate
                },
                date: new Date()
            });

            // 4. CUSTOMER 360 SYNC: Push to Customer Notes
            // This ensures looking at the main Customer Profile shows this interaction
            const noteContent = `[Insurance ${type || 'Log'}] Outcome: ${outcome} \nRemark: ${remark} \nNext Follow-up: ${nextFollowUpDate ? new Date(nextFollowUpDate).toLocaleDateString() : 'N/A'}`;
            
            await Customer.findByIdAndUpdate(policy.customer, {
                $push: {
                    notes: {
                        content: noteContent,
                        addedBy: userId,
                        createdAt: new Date()
                    }
                }
            });

        } catch (e) {
            console.error('Failed to sync global interaction/notes:', e.message);
        }

        res.json(policy);

    } catch (error) {
        console.error('Log Action Error:', error);
        res.status(500).json({ message: 'Error logging action', error: error.message });
    }
};

exports.getInteractions = async (req, res) => {
    try {
        const { customerId } = req.params;
        // Fetch interactions from Interactions collection (legacy)
        const legacy = await Interaction.find({ customer: customerId })
            .sort({ date: -1 });
        
        // Also fetch from Policy embedded (future proofing) if we can match customer
        // But for now, let's keep it simple. If we move fully to embedded, we should fetch from Policy.
        // Actually, the frontend CustomerDetailModal fetches from /api/insurance/interactions/:customerId
        // The new addInteraction writes to Policy.interactions. 
        // WE HAVE A DISCONNECT.
        
        // FIX: Verify if we should search Policies for this customer and aggregate interactions?
        // Or keep dual write? 
        // The addInteraction above writes to Policy. 
        // This getInteractions reads from Interaction model.
        // THEY ARE DISCONNECTED.
        
        // IMMEDIATE FIX: Write to BOTH or read from BOTH.
        // Since we refactored to Policy-centric, we should read from Policy as well.
        
        const policies = await InsurancePolicy.find({ customer: customerId }).select('interactions');
        let policyInteractions = [];
        policies.forEach(p => {
             if (p.interactions) {
                 policyInteractions = [...policyInteractions, ...p.interactions.map(i => ({
                     ...i.toObject(),
                     date: i.createdAt,
                     data: { remark: i.remark, outcome: i.outcome, nextFollowUp: i.nextFollowUpDate },
                     agentName: 'Agent' // Populate if needed
                 }))];
             }
        });

        // Merge and Sort
        const allInteractions = [...legacy, ...policyInteractions].sort((a,b) => new Date(b.date) - new Date(a.date));
        
        res.json(allInteractions);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching interactions' });
    }
};

exports.logWorkflowAction = async (req, res) => {
    res.status(410).json({ message: 'Use /policies/:id/interaction endpoint' });
};
exports.importPolicies = async (req, res) => {
    try {
        const { policies, preview = false } = req.body; // Expects array directly now, or { policies, preview }
        
        // Normalize input if just array passed
        const rows = Array.isArray(req.body) ? req.body : policies;

        if (!rows || !Array.isArray(rows)) {
            return res.status(400).json({ message: 'Invalid data format. Expected array of policies.' });
        }

        // Helper for Date Parsing
        const parseDate = (dateStr) => {
            if (!dateStr) return null;
            if (typeof dateStr === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
                const [day, month, year] = dateStr.split('-');
                return new Date(`${year}-${month}-${day}`);
            }
            if (typeof dateStr === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
                const [day, month, year] = dateStr.split('/');
                return new Date(`${year}-${month}-${day}`);
            }
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? null : d;
        };

        const results = {
            total: rows.length,
            success: 0,
            failed: 0,
            skipped: 0,
            errors: [], // { row: 1, error: '...' }
            previewData: [] // For UI confirmation
        };

        // SELF-HEAL: Ensure email index is sparse by dropping potentially bad index
        try {
            await Customer.collection.dropIndex('email_1');
            console.log('Dropped email_1 index to ensure sparsity');
        } catch (e) {
            // Ignore if index doesn't exist
        }

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

        // --- COMMIT MODE ---
        // Optimization: Parallel Batch Processing to prevent Timeouts
        const batchSize = 20; // Process 20 records at a time
        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            
            await Promise.all(batch.map(async (row, batchIdx) => {
                const globalIndex = i + batchIdx;
                try {
                    // 1. Validation & Skip (Silent skip for bad data to focus on bulk)
                    if (!row.policyNumber || !row.mobile) {
                        results.failed++;
                        results.errors.push(`Row ${globalIndex + 1}: Missing mandatory fields`);
                        return;
                    }

                    // Normalize Data
                    const normalizedMobile = row.mobile.toString().replace(/\D/g, '').slice(-10);
                    const normalizedEmail = row.email ? row.email.toLowerCase().trim() : undefined;

                    const existingPolicy = await InsurancePolicy.findOne({ policyNumber: row.policyNumber });
                    if (existingPolicy) {
                        results.skipped++;
                        return;
                    }

                    // 2. Find or Create Customer
                    let customer;
                    // Optimization: We could cache recent customers in memory map for this batch but risk is low for 500 rows.
                    const matches = await findPotentialMatches({
                        mobile: normalizedMobile,
                        vehicleReg: row.regNumber,
                        email: normalizedEmail,
                        name: row.customerName
                    });

                    if (matches.length > 0) {
                        // LINK
                        customer = await Customer.findById(matches[0]._id);
                        if (!customer) { // Safety check
                             throw new Error('Matched customer not found');
                        }

                        let needsSave = false;
                        if (row.regNumber && !customer.vehicles.some(v => v.regNumber === row.regNumber.toUpperCase())) {
                            customer.vehicles.push({
                                regNumber: row.regNumber.toUpperCase(),
                                make: row.make,
                                model: row.model,
                                variant: row.variant,
                                fuelType: row.fuelType,
                                yearOfManufacture: row.yearOfManufacture,
                                registrationDate: parseDate(row.registrationDate)
                            });
                            needsSave = true;
                        }
                        if (!customer.areaCity && row.areaCity) {
                            customer.areaCity = row.areaCity;
                            needsSave = true;
                        }
                        if (needsSave) await customer.save();

                    } else {
                        // CREATE
                        const customId = await generateCustomId();
                        customer = new Customer({
                            customId,
                            name: row.customerName || 'Unknown',
                            mobile: normalizedMobile,
                            email: normalizedEmail, // Avoid saving null to prevent unique index error
                            areaCity: row.areaCity,
                            vehicles: row.regNumber ? [{
                                regNumber: row.regNumber.toUpperCase(),
                                make: row.make,
                                model: row.model,
                                variant: row.variant,
                                fuelType: row.fuelType,
                                yearOfManufacture: row.yearOfManufacture,
                                yearOfManufacture: row.yearOfManufacture,
                                registrationDate: parseDate(row.registrationDate)
                            }] : []
                        });
                        await customer.save();
                    }

                    // 3. Create Policy
                    // parseDate moved to top scope

                    const pEndDate = parseDate(row.expiryDate);
                    const pStartDate = parseDate(row.policyStartDate);
                    const isExpired = pEndDate && pEndDate < new Date();

                    const policy = new InsurancePolicy({
                        customer: customer._id,
                        policyNumber: row.policyNumber,
                        insurer: row.insurer || 'Unknown',
                        policyType: row.policyType,
                        source: row.source || 'Import',
                        policyStartDate: pStartDate,
                        policyEndDate: pEndDate,
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
                        renewalStatus: isExpired ? 'Pending' : 'Pending',
                    });

                    await policy.save();
                    results.success++;

                } catch (err) {
                    results.failed++;
                    results.errors.push(`Row ${globalIndex + 1} (${row.policyNumber}): ${err.message}`);
                    console.error(`Import Error Row ${globalIndex}:`, err); // Keep simple log
                }
            }));
        }

        res.json({ message: 'Import processed', results });

    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ message: 'Server error during import' });
    }
    }

// --- WORKFLOW ACTIONS ---
// --- ACTIONS ---

exports.addInteraction = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, outcome, remark, nextFollowUpDate, lostReason } = req.body;
        const userId = req.user ? req.user._id : null;

        const policy = await InsurancePolicy.findById(id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });

        // Push Interaction
        policy.interactions.push({
            type: type || 'Other',
            outcome,
            remark,
            nextFollowUpDate,
            createdBy: userId
        });

        // Update Top-level fields
        policy.lastInteractionDate = new Date();
        policy.lastRemark = remark;
        if (nextFollowUpDate) {
            policy.nextFollowUpDate = nextFollowUpDate;
        }

        // Auto-Mapping Logic
        // 1. Stage Mapping
        const outcomeToStage = {
            'Contacted': 'Contacted',
            'QuoteSent': 'QuoteSent',
            'Negotiation': 'Negotiation',
            'Accepted': 'Accepted',
            'PaymentLinkSent': 'PaymentPending',
            'PaymentReceived': 'PaymentReceived'
        };
        if (outcomeToStage[outcome]) {
            policy.renewalStage = outcomeToStage[outcome];
        } else if (outcome === 'CallbackLater') {
            policy.renewalStage = 'FollowUp';
        }

        // 2. Status Mapping
        if (['Contacted', 'QuoteSent', 'Negotiation', 'Accepted', 'CallbackLater', 'PaymentLinkSent'].includes(outcome)) {
            if (policy.renewalStatus === 'Pending') policy.renewalStatus = 'InProgress';
        } else if (outcome === 'NotInterested') {
            policy.renewalStatus = 'NotInterested';
            if (lostReason) policy.lostReason = lostReason;
        } else if (outcome === 'RenewedElsewhere') {
            policy.renewalStatus = 'Lost';
            policy.lostReason = 'RenewedElsewhere';
        }

        await policy.save();
        res.json(policy);

    } catch (error) {
        console.error('Log Action Error:', error);
        res.status(500).json({ message: 'Error logging action' });
    }
};

exports.logWorkflowAction = async (req, res) => {
    res.status(410).json({ message: 'Use /policies/:id/interaction endpoint' });
};

// --- HELPERS ---

const findPotentialMatches = async ({ mobile, vehicleReg, email, name }) => {
    const query = { $or: [] };
    
    // 1. Mobile Match (Strongest)
    if (mobile) query.$or.push({ mobile: mobile });
    
    // 2. Vehicle Reg Match
    if (vehicleReg) {
        query.$or.push({ "vehicles.regNumber": vehicleReg.toUpperCase() });
    }
    
    // 3. Email Match
    if (email && email.length > 5) query.$or.push({ email: email.toLowerCase() });

    if (query.$or.length === 0) return [];

    // Return fields needed for decision
    return await Customer.find(query).select('_id name mobile email areaCity vehicles');
};
