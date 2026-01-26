const WorkshopBooking = require('../models/workshopBooking')
const sendEmail = require('../utils/email')
const { sendEvent } = require('../services/facebookCAPIService');

// Create a workshop booking
exports.createWorkshopBooking = async (req, res) => {
  try {
    const newBooking = new WorkshopBooking(req.body)
    await newBooking.save()

    // [Meta CAPI] Fire Schedule Event
    sendEvent('Schedule', {
        phone: newBooking.mobileNumber,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
    }, {
        content_name: 'Workshop Service Booking',
        content_type: 'service',
        status: newBooking.serviceType
    });

    // Send Email Notification to Dealership
    const message = `
      🔔 New Workshop Booking!

      Customer: ${newBooking.name}
      Phone: ${newBooking.mobileNumber}
      Car: ${newBooking.carModel}
      Service: ${newBooking.serviceType}
      Requested Date: ${new Date(newBooking.date).toLocaleDateString()}
      
      Message: ${newBooking.message || 'No specific message.'}

      Please log in to the admin panel to confirm this appointment.
    `;

    try {
      await sendEmail({
        email: ['poddarranchi@gmail.com', 'amanpoddar9@gmail.com'], // Send to both
        subject: `🛠 New Workshop Booking: ${newBooking.name} - ${newBooking.carModel}`,
        message: message
      });
    } catch (emailError) {
      console.error('Failed to send workshop notification email:', emailError);
      // We do not fail the request if email fails, just log it.
    }

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
