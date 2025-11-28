const PriceAlert = require('../models/priceAlert')
const Listing = require('../models/listing')

// Create a new price alert
exports.createPriceAlert = async (req, res) => {
  try {
    const { listingId, email, phone, alertType, targetPrice, currentPrice, carName } = req.body

    // Validate listing exists
    const listing = await Listing.findById(listingId)
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' })
    }

    // Check if alert already exists for this user and listing
    const existingAlert = await PriceAlert.findOne({
      listingId,
      email,
      isActive: true
    })

    if (existingAlert) {
      // Update existing alert
      existingAlert.alertType = alertType
      existingAlert.targetPrice = targetPrice
      existingAlert.currentPrice = currentPrice
      existingAlert.phone = phone
      await existingAlert.save()
      return res.status(200).json({ message: 'Price alert updated successfully', alert: existingAlert })
    }

    // Create new alert
    const alert = new PriceAlert({
      listingId,
      email,
      phone,
      alertType,
      targetPrice,
      currentPrice,
      carName
    })

    await alert.save()
    res.status(201).json({ message: 'Price alert created successfully', alert })
  } catch (error) {
    console.error('Error creating price alert:', error)
    res.status(500).json({ message: 'Failed to create price alert', error: error.message })
  }
}

// Get all alerts for a user
exports.getUserAlerts = async (req, res) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const alerts = await PriceAlert.find({ email, isActive: true })
      .populate('listingId', 'brand model variant price images slug')
      .sort({ createdAt: -1 })

    // Update current prices
    const updatedAlerts = alerts.map(alert => {
      if (alert.listingId) {
        alert.currentPrice = alert.listingId.price
      }
      return alert
    })

    res.status(200).json(updatedAlerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message })
  }
}

// Delete an alert
exports.deletePriceAlert = async (req, res) => {
  try {
    const { id } = req.params

    const alert = await PriceAlert.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    )

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' })
    }

    res.status(200).json({ message: 'Alert deleted successfully' })
  } catch (error) {
    console.error('Error deleting alert:', error)
    res.status(500).json({ message: 'Failed to delete alert', error: error.message })
  }
}

// Check and send notifications for price changes (called by admin or cron job)
exports.checkPriceAlerts = async (req, res) => {
  try {
    const { listingId } = req.params

    const listing = await Listing.findById(listingId)
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' })
    }

    const alerts = await PriceAlert.find({ listingId, isActive: true })
    const notifications = []

    for (const alert of alerts) {
      let shouldNotify = false

      switch (alert.alertType) {
        case 'price_drop':
          shouldNotify = listing.price < alert.currentPrice
          break
        case 'any_change':
          shouldNotify = listing.price !== alert.currentPrice
          break
        case 'specific_price':
          shouldNotify = listing.price <= alert.targetPrice
          break
      }

      if (shouldNotify) {
        // TODO: Send email/SMS notification
        // For now, just log
        notifications.push({
          email: alert.email,
          phone: alert.phone,
          oldPrice: alert.currentPrice,
          newPrice: listing.price,
          carName: alert.carName
        })

        // Update alert
        alert.currentPrice = listing.price
        alert.lastNotified = new Date()
        await alert.save()
      }
    }

    res.status(200).json({
      message: 'Price alerts checked',
      notificationsSent: notifications.length,
      notifications
    })
  } catch (error) {
    console.error('Error checking price alerts:', error)
    res.status(500).json({ message: 'Failed to check alerts', error: error.message })
  }
}
