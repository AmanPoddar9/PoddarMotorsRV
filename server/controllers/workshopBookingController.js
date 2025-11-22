const WorkshopBooking = require('../models/workshopBooking')

// Create a workshop booking
exports.createWorkshopBooking = async (req, res) => {
  try {
    const newBooking = new WorkshopBooking(req.body)
    await newBooking.save()
    res.status(201).json(newBooking)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get all workshop bookings
exports.getAllWorkshopBookings = async (req, res) => {
  try {
    const bookings = await WorkshopBooking.find({ archived: false }).sort({ createdAt: -1 })
    res.status(200).json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get archived workshop bookings
exports.getArchivedWorkshopBookings = async (req, res) => {
  try {
    const bookings = await WorkshopBooking.find({ archived: true }).sort({ createdAt: -1 })
    res.status(200).json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Archive a workshop booking
exports.archiveWorkshopBooking = async (req, res) => {
  try {
    const booking = await WorkshopBooking.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    )
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.status(200).json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a workshop booking
exports.deleteWorkshopBooking = async (req, res) => {
  try {
    const booking = await WorkshopBooking.findByIdAndDelete(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.status(200).json({ message: 'Booking deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
