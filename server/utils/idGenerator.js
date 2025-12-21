const Customer = require('../models/Customer');
const Counter = require('../models/Counter');

/**
 * Generates a unique custom ID for a customer using Atomic Counter.
 * Format: PM-{YY}-{XXXXX}  (e.g., PM-25-00001)
 */
exports.generateCustomId = async () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // "25"
    const prefix = `PM-${year}-`;
    const counterId = `customer_${year}`; // Unique counter per year

    // 1. Atomically increment and get new sequence
    let counter = await Counter.findByIdAndUpdate(
        { _id: counterId },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create if not exists with seq: 1 (after inc? no, default is 0 so inc 1 makes it 1)
                                     // Mongoose 5/6 upsert behavior:
                                     // If doc missing: creates { _id: counterId, seq: 1 } (because $inc applied to default 0? wait check)
                                     // Actually usually $inc on upsert works fine.
    );

    // SAFETY CHECK: If we just created the counter (seq likely 1), verify we aren't overwriting existing data.
    // This handles the migration case where many users exist but no counter exists yet.
    if (counter.seq === 1) {
        // Find REAL max in DB
        const lastCustomer = await Customer.findOne({ 
            customId: { $regex: `^${prefix}` } 
        }).sort({ customId: -1 });

        if (lastCustomer) {
            const parts = lastCustomer.customId.split('-');
            const lastSeq = parseInt(parts[2], 10);
            if (!isNaN(lastSeq)) {
                // We found existing data! Update counter to continue from there.
                // We want next ID to be lastSeq + 1. 
                // So set seq to lastSeq + 1
                counter = await Counter.findByIdAndUpdate(
                    { _id: counterId },
                    { $set: { seq: lastSeq + 1 } },
                    { new: true }
                );
            }
        }
    }

    // Pad with leading zeros to 5 digits
    const sequenceStr = counter.seq.toString().padStart(5, '0');
    return `${prefix}${sequenceStr}`;
};

/**
 * Generates a batch of sequential custom IDs.
 * Use this for bulk imports to avoid N database calls.
 * @param {number} count - Number of IDs to generate
 * @returns {Promise<string[]>} - Array of formatted IDs
 */
exports.generateBulkIds = async (count) => {
    if (count < 1) return [];

    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const prefix = `PM-${year}-`;
    const counterId = `customer_${year}`;

    // 1. Atomically increment by 'count'
    // Returns the NEW value (e.g., if old was 10 and count is 5, returns 15)
    // IDs reserved are: 11, 12, 13, 14, 15
    const counter = await Counter.findByIdAndUpdate(
        { _id: counterId },
        { $inc: { seq: count } },
        { new: true, upsert: true }
    );

    // Calculate the start of the range
    const endSeq = counter.seq;
    const startSeq = endSeq - count + 1;

    const ids = [];
    for (let i = startSeq; i <= endSeq; i++) {
        ids.push(`${prefix}${i.toString().padStart(5, '0')}`);
    }
    return ids;
};
