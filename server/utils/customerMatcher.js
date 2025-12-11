const Customer = require('../models/Customer');

/**
 * Finds potential customer matches based on key identifiers.
 * @param {Object} candidate - { mobile, vehicleReg, name, email }
 * @returns {Promise<Array>} - List of matching customer documents with 'matchReason'
 */
exports.findPotentialMatches = async (candidate) => {
  const matches = [];
  const { mobile, vehicleReg, email } = candidate;

  if (!mobile && !vehicleReg && !email) return [];

  const criteria = [];

  // 1. Mobile Match (Primary) - Checks mobile AND alternatePhones
  if (mobile) {
    criteria.push({
      $or: [
        { mobile: mobile },
        { alternatePhones: mobile }
      ]
    });
  }

  // 2. Vehicle Registration Match
  if (vehicleReg) {
    criteria.push({
      'vehicles.regNumber': vehicleReg.toUpperCase() 
    });
  }

  // 3. Email Match
  if (email) {
    criteria.push({ email: email });
  }

  if (criteria.length === 0) return [];

  // Execute query
  const customers = await Customer.find({
    $or: criteria
  });

  // Annotate matches
  return customers.map(c => {
    const reasons = [];
    if (c.mobile === mobile || c.alternatePhones.includes(mobile)) reasons.push('mobile');
    if (c.email && c.email === email) reasons.push('email');
    if (vehicleReg && c.vehicles.some(v => v.regNumber === vehicleReg.toUpperCase())) reasons.push('vehicle');
    
    return {
      _id: c._id,
      name: c.name,
      mobile: c.mobile,
      customId: c.customId,
      vehicles: c.vehicles,
      matchReason: reasons // ['mobile', 'vehicle']
    };
  });
};
