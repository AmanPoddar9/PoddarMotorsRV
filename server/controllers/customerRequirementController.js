const CarRequirement = require('../models/CarRequirement');

// Create a new requirement
exports.createRequirement = async (req, res) => {
  try {
    const { brand, model, budgetMin, budgetMax, yearMin } = req.body;
    
    const requirement = new CarRequirement({
      customer: req.user.id,
      brand,
      model,
      budgetMin: budgetMin || 0,
      budgetMax,
      yearMin: yearMin || 2010
    });

    await requirement.save();
    res.status(201).json(requirement);
  } catch (error) {
    console.error('Error creating requirement:', error);
    res.status(500).json({ message: 'Error creating requirement' });
  }
};

// Get user's requirements
exports.getRequirements = async (req, res) => {
  try {
    const requirements = await CarRequirement.find({ customer: req.user.id })
      .sort({ createdAt: -1 });
    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requirements' });
  }
};

// Delete a requirement
exports.deleteRequirement = async (req, res) => {
  try {
    const requirement = await CarRequirement.findOneAndDelete({
      _id: req.params.id,
      customer: req.user.id
    });
    
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    
    res.json({ message: 'Requirement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting requirement' });
  }
};
