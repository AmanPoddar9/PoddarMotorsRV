const TestDriveBooking = require('../models/testDriveBooking')
const Listing = require('../models/listing')

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { listingId, date, email, time, name, mobileNumber } = req.body
    const booking = new TestDriveBooking({ listingId, email, date, time, name, mobileNumber })
    await booking.save()
    res.status(201).json({ message: 'Booking created successfully', booking })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Read all bookings
exports.getAllBookings = async (req, res) => {
  try {
    // Find all bookings where archive is false, sorted by createdAt in descending order
    let bookings = await TestDriveBooking.find({ archived: false })

      .populate({
        path: 'listingId',
        select: 'brand model vehicleNumber',
        model: Listing, // Specify the model to use for population
      })

    bookings.reverse()

    res.json(bookings)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

exports.getArchivedBookings = async (req, res) => {
  try {
    // Find all bookings where archive is false, sorted by createdAt in descending order
    let bookings = await Booking.find({ archived: true }).populate({
      path: 'listingId',
      select: 'brand model vehicleNumber',
      model: Listing, // Specify the model to use for population
    })

    bookings.reverse()

    res.json(bookings)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params

    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
    })

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.json(updatedBooking)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params

    const deletedBooking = await Booking.findByIdAndDelete(id)

    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
