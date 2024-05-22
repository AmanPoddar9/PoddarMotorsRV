const Feature = require('../models/features')

// Create a new feature
exports.createFeature = async (req, res) => {
  try {
    const { text } = req.body
    const feature = new Feature({ text })
    await feature.save()
    res.status(201).json(feature)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Read all features
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find()
    res.json(features)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Delete a feature by ID
exports.deleteFeatureById = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id)
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' })
    }
    await feature.deleteOne({ _id: feature._id })
    res.json({ message: 'Feature deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
