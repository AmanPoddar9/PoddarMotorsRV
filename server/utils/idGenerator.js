const Customer = require('../models/Customer');

/**
 * Generates a unique custom ID for a customer.
 * Format: PM-{YY}-{XXXXX}  (e.g., PM-25-00001)
 */
exports.generateCustomId = async () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // "25"
    const prefix = `PM-${year}-`;

    // Find the last customer created *in this year* with a customId
    // Optimization: We rely on the fact that customId is sortable strings
    const lastCustomer = await Customer.findOne({ 
        customId: { $regex: `^${prefix}` } 
    }).sort({ customId: -1 });

    let sequence = 1;
    if (lastCustomer && lastCustomer.customId) {
        const parts = lastCustomer.customId.split('-');
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
            sequence = lastSeq + 1;
        }
    }

    // Pad with leading zeros to 5 digits
    const sequenceStr = sequence.toString().padStart(5, '0');
    return `${prefix}${sequenceStr}`;
};
