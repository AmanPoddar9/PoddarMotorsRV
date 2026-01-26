const SellRequest = require('../models/sellRequest')
const { sendEvent } = require('../services/facebookCAPIService');

// Create a new sell request
exports.createSellRequest = async (req, res) => {
  try {
    const sellRequest = new SellRequest(req.body)
    await sellRequest.save()

    // [Meta CAPI] Fire Lead Event (Seller)
    sendEvent('Lead', {
        phone: sellRequest.phoneNumber,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
    }, {
        content_name: 'Car Sell Request',
        content_category: 'Seller',
        value: sellRequest.expectedPrice, // If available
        currency: 'INR'
    });

    res
      .status(201)
      .json({ message: 'Sell request created successfully', sellRequest })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Read all sell requests
exports.getAllSellRequests = async (req, res) => {
  try {
    const sellRequests = await SellRequest.find({ archived: false })
    res.json(sellRequests)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

exports.getArchivedSellRequests = async (req, res) => {
  try {
    const sellRequests = await SellRequest.find({ archived: true })
    res.json(sellRequests)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

// Delete a sell request
exports.deleteSellRequest = async (req, res) => {
  try {
    const { id } = req.params
    const deletedSellRequest = await SellRequest.findByIdAndDelete(id)
    if (!deletedSellRequest) {
      return res.status(404).json({ error: 'Sell request not found' })
    }
    res.json({ message: 'Sell request deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

// Update the status of a sell request
exports.updateSellRequest = async (req, res) => {
  try {
    const { id } = req.params

    const updatedSellRequest = await SellRequest.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )

    if (!updatedSellRequest) {
      return res.status(404).json({ error: 'Sell request not found' })
    }

    res.json(updatedSellRequest)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
