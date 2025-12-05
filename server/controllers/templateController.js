const InspectionTemplate = require('../models/InspectionTemplate')

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await InspectionTemplate.find().select('name description isDefault createdAt')
    res.json(templates)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get active/default template
exports.getDefaultTemplate = async (req, res) => {
  try {
    let template = await InspectionTemplate.findOne({ isDefault: true })
    
    // Fallback: if no default, get the first one, or return 404
    if (!template) {
      template = await InspectionTemplate.findOne()
    }
    
    if (!template) {
      return res.status(404).json({ message: 'No templates found' })
    }
    
    res.json(template)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await InspectionTemplate.findById(req.params.id)
    if (!template) {
      return res.status(404).json({ message: 'Template not found' })
    }
    res.json(template)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create new template
exports.createTemplate = async (req, res) => {
  try {
    const template = new InspectionTemplate(req.body)
    const savedTemplate = await template.save()
    res.status(201).json(savedTemplate)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    const template = await InspectionTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!template) {
      return res.status(404).json({ message: 'Template not found' })
    }
    res.json(template)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await InspectionTemplate.findById(req.params.id)
    if (!template) {
      return res.status(404).json({ message: 'Template not found' })
    }
    
    if (template.isDefault) {
      return res.status(400).json({ message: 'Cannot delete the default template' })
    }
    
    await template.deleteOne()
    res.json({ message: 'Template deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Seed Default Template (Helper)
exports.seedDefaultTemplate = async () => {
  const count = await InspectionTemplate.countDocuments()
  if (count === 0) {
    const defaultTemplate = new InspectionTemplate({
      name: 'Standard Car Inspection',
      description: 'Default inspection template',
      isDefault: true,
      categories: [], // Populate this with existing structure if needed
      photoRequirements: [
        // Exterior
        { key: 'front34', label: 'Front 3/4 View', category: 'Exterior' },
        { key: 'rear34', label: 'Rear 3/4 View', category: 'Exterior' },
        { key: 'leftSide', label: 'Left Side', category: 'Exterior' },
        { key: 'rightSide', label: 'Right Side', category: 'Exterior' },
        { key: 'frontHeadOn', label: 'Front Head On', category: 'Exterior' },
        { key: 'rearStraight', label: 'Rear Straight', category: 'Exterior' },
        
        // Interior
        { key: 'odometerIGNON', label: 'Odometer (IGN ON)', category: 'Interior' },
        { key: 'warningLampsCluster', label: 'Warning Lamps Cluster', category: 'Interior' },
        { key: 'vinEmbossingCloseUp', label: 'VIN Embossing', category: 'Details' },
        { key: 'engineBay', label: 'Engine Bay', category: 'Engine' },
        { key: 'bootFloorSpareWell', label: 'Boot Floor / Spare Well', category: 'Interior' },
        
        // Undercarriage
        { key: 'lowerCrossMemberUnderBumper', label: 'Lower Cross Member', category: 'Undercarriage' },
        { key: 'apronLHPhoto', label: 'Apron LH', category: 'Undercarriage' },
        { key: 'apronRHPhoto', label: 'Apron RH', category: 'Undercarriage' },
        { key: 'chassisRailsUnderbody', label: 'Chassis Rails', category: 'Undercarriage' },
        
        // Tyres
        { key: 'tyreLFCloseUp', label: 'Tyre LF', category: 'Tyres' },
        { key: 'tyreRFCloseUp', label: 'Tyre RF', category: 'Tyres' },
        { key: 'tyreLRCloseUp', label: 'Tyre LR', category: 'Tyres' },
        { key: 'tyreRRCloseUp', label: 'Tyre RR', category: 'Tyres' },
        { key: 'spareTyre', label: 'Spare Tyre', category: 'Tyres' },
        
        // Documents
        { key: 'rcFront', label: 'RC Front', category: 'Documents' },
        { key: 'insurance', label: 'Insurance', category: 'Documents' },
        { key: 'puc', label: 'PUC Certificate', category: 'Documents' },
      ]
    })
    await defaultTemplate.save()
    console.log('Seeded default inspection template')
  }
}
