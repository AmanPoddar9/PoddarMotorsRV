const ScrapRequest = require('../models/scrapRequest')

// Create a new scrap request
const createScrapRequest = async (req, res) => {
  try {
    const scrapRequest = new ScrapRequest(req.body)
    await scrapRequest.save()
    res.status(201).json(scrapRequest)
  } catch (error) {
    console.error('Error creating scrap request:', error)
    res.status(400).json({ error: error.message })
  }
}

// Get all scrap requests
const getAllScrapRequests = async (req, res) => {
  try {
    const { status, archived } = req.query
    const filter = {}

    if (status) filter.status = status
    if (archived !== undefined) filter.archived = archived === 'true'

    const scrapRequests = await ScrapRequest.find(filter).sort({
      createdAt: -1,
    })
    res.status(200).json(scrapRequests)
  } catch (error) {
    console.error('Error fetching scrap requests:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get single scrap request by ID
const getScrapRequestById = async (req, res) => {
  try {
    const scrapRequest = await ScrapRequest.findById(req.params.id)
    if (!scrapRequest) {
      return res.status(404).json({ error: 'Scrap request not found' })
    }
    res.status(200).json(scrapRequest)
  } catch (error) {
    console.error('Error fetching scrap request:', error)
    res.status(500).json({ error: error.message })
  }
}

// Update scrap request
const updateScrapRequest = async (req, res) => {
  try {
    const scrapRequest = await ScrapRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    )
    if (!scrapRequest) {
      return res.status(404).json({ error: 'Scrap request not found' })
    }
    res.status(200).json(scrapRequest)
  } catch (error) {
    console.error('Error updating scrap request:', error)
    res.status(400).json({ error: error.message })
  }
}

// Delete/archive scrap request
const deleteScrapRequest = async (req, res) => {
  try {
    const scrapRequest = await ScrapRequest.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true },
    )
    if (!scrapRequest) {
      return res.status(404).json({ error: 'Scrap request not found' })
    }
    res.status(200).json({ message: 'Scrap request archived successfully' })
  } catch (error) {
    console.error('Error archiving scrap request:', error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createScrapRequest,
  getAllScrapRequests,
  getScrapRequestById,
  updateScrapRequest,
  deleteScrapRequest,
}
