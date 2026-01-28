const cron = require('node-cron');
const InsurancePolicy = require('../models/InsurancePolicy');
const Interaction = require('../models/Interaction');
const Customer = require('../models/Customer');
const { sendInsuranceReminder } = require('../controllers/metaController');

const checkAndSendReminders = async () => {
    console.log('[Insurance Scheduler] Running daily check for lapsing policies...');
    
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Define Buckets to check
        // 1. 30 Days Left
        // 2. 7 Days Left
        // 3. 1 Day Left (Tomorrow)
        // 4. Due Today

        const buckets = [
            { days: 30, label: '30Day' },
            { days: 7, label: '7Day' },
            { days: 1, label: '1Day' },
            { days: 0, label: 'Due' }
        ];

        for (const bucket of buckets) {
            const targetDate = new Date(today);
            targetDate.setDate(targetDate.getDate() + bucket.days);
            
            const startOfDay = new Date(targetDate); startOfDay.setHours(0,0,0,0);
            const endOfDay = new Date(targetDate); endOfDay.setHours(23,59,59,999);

            // Find policies expiring on this specific target date
            // AND ensure we haven't already sent a reminder for this specific status (optional, but good for safety)
            // For now, we rely on the daily cron picking them up exactly once per year implementation
            // But we should check `reminderStatus` to avoid re-sending if job re-runs.
            
            const policies = await InsurancePolicy.find({
                policyEndDate: { $gte: startOfDay, $lte: endOfDay },
                renewalStatus: { $in: ['Pending', 'InProgress'] },
                reminderStatus: { $ne: bucket.label } // Avoid duplicate for same bucket
            }).populate('customer');

            console.log(`[Insurance Scheduler] Found ${policies.length} policies expiring in ${bucket.days} days.`);

            for (const policy of policies) {
                if (!policy.customer || !policy.customer.mobile) {
                    console.log(`[Insurance Scheduler] Skipping Policy ${policy.policyNumber} (No Customer/Mobile)`);
                    continue;
                }

                // Send WhatsApp
                const result = await sendInsuranceReminder(policy.customer, policy, bucket.days);

                if (result && result.success) {
                    // Update Policy Status
                    policy.reminderStatus = bucket.label;
                    
                    // Log Interaction
                    const remark = `Auto-Reminder Sent (${bucket.days} Days Left)`;
                    policy.interactions.push({
                        type: 'WhatsApp',
                        outcome: `${bucket.days}DayReminder`,
                        remark: remark,
                        createdBy: null // System
                    });
                    
                    await policy.save();

                    // Global Interaction Log
                    await Interaction.create({
                        customer: policy.customer._id,
                        policy: policy._id,
                        type: 'WhatsApp',
                        agentName: 'System (Auto-Reminder)',
                        data: {
                            remark: remark,
                            outcome: `${bucket.days}DayReminder`
                        },
                        date: new Date()
                    });
                }
            }
        }
        console.log('[Insurance Scheduler] Daily check completed.');

    } catch (error) {
        console.error('[Insurance Scheduler] Error in daily job:', error);
    }
};

// Initialize Scheduler
const initScheduler = () => {
    // Run every day at 10:00 AM
    // Cron format: Minute Hour Day Month Weekday
    cron.schedule('0 10 * * *', () => {
        checkAndSendReminders();
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
    
    console.log('[Insurance Scheduler] Initialized (Daily 10:00 AM IST)');
};

module.exports = { initScheduler, checkAndSendReminders };
