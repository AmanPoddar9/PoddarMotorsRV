const InspectionBooking = require('../models/InspectionBooking')
const InspectionReport = require('../models/InspectionReport')
const crypto = require('crypto')

// Create a new inspection booking
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body
    
    // Validate appointment date is not in the past
    const appointmentDateTime = new Date(bookingData.appointmentDate)
    if (appointmentDateTime < new Date()) {
      return res.status(400).json({ error: 'Appointment date cannot be in the past' })
    }
    
    // Check if slot is available (max 4 bookings per slot)
    const existingBookings = await InspectionBooking.countDocuments({
      appointmentDate: bookingData.appointmentDate,
      appointmentTimeSlot: bookingData.appointmentTimeSlot,
      status: { $nin: ['Cancelled'] }
    })
    
    if (existingBookings >= 4) {
      return res.status(400).json({ error: 'This time slot is fully booked. Please choose another slot.' })
    }
    
    if (bookingData.paymentStatus === 'Free') {
      bookingData.status = 'Confirmed'
    }

    const booking = new InspectionBooking(bookingData)
    await booking.save()
    
    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking,
      bookingReference: booking._id 
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    res.status(400).json({ error: error.message })
  }
}

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, fromDate, toDate } = req.query
    
    let query = {}
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (fromDate || toDate) {
      query.appointmentDate = {}
      if (fromDate) query.appointmentDate.$gte = new Date(fromDate)
      if (toDate) query.appointmentDate.$lte = new Date(toDate)
    }
    
    const bookings = await InspectionBooking.find(query)
      .sort({ appointmentDate: 1, createdAt: -1 })
      .populate('inspectionReportId')
    
    res.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await InspectionBooking.findById(req.params.id)
      .populate('inspectionReportId')
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    
    res.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    res.status(500).json({ error: error.message })
  }
}

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, cancellationReason } = req.body
    
    const updateData = { status }
    
    if (status === 'Cancelled') {
      updateData.cancelledAt = new Date()
      if (cancellationReason) {
        updateData.cancellationReason = cancellationReason
      }
    }
    
    if (status === 'Completed') {
      updateData.completedAt = new Date()
    }
    
    const booking = await InspectionBooking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    
    res.json({ message: 'Booking updated successfully', booking })
  } catch (error) {
    console.error('Error updating booking:', error)
    res.status(500).json({ error: error.message })
  }
}

// Assign inspector to booking
exports.assignInspector = async (req, res) => {
  try {
    const { id } = req.params
    const { inspectorName, inspectorPhone } = req.body
    
    // Generate secure inspector token
    const inspectorToken = crypto.randomBytes(32).toString('hex')
    const inspectorTokenExpiry = new Date()
    inspectorTokenExpiry.setDate(inspectorTokenExpiry.getDate() + 7) // 7 days validity
    
    const booking = await InspectionBooking.findByIdAndUpdate(
      id,
      {
        assignedInspector: {
          name: inspectorName,
          phone: inspectorPhone,
          assignedAt: new Date()
        },
        inspectorToken,
        inspectorTokenExpiry,
        inspectorTokenUsed: false,
        status: 'Inspector Assigned'
      },
      { new: true }
    )
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    
    // Generate inspector link
    const inspectorLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/inspector/report/create?token=${inspectorToken}`
    
    res.json({ 
      message: 'Inspector assigned successfully', 
      booking,
      inspectorLink,
      tokenExpiry: inspectorTokenExpiry
    })
  } catch (error) {
    console.error('Error assigning inspector:', error)
    res.status(500).json({ error: error.message })
  }
}

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { paymentStatus, paymentId, orderId } = req.body
    
    const booking = await InspectionBooking.findByIdAndUpdate(
      id,
      {
        paymentStatus,
        paymentId,
        orderId,
        status: paymentStatus === 'Paid' ? 'Confirmed' : 'Pending'
      },
      { new: true }
    )
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    
    res.json({ message: 'Payment status updated', booking })
  } catch (error) {
    console.error('Error updating payment:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get available time slots for a date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' })
    }
    
    const allSlots = ['09:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00']
    
    // Check if the selected date is today
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isToday = selectedDate.getTime() === today.getTime()
    
    // Filter out past slots if it's today
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    let availableSlotsForDay = allSlots
    
    if (isToday) {
      availableSlotsForDay = allSlots.filter(slot => {
        // Extract start time from slot (e.g., "09:00" from "09:00-11:00")
        const [startTime] = slot.split('-')
        const [slotHour, slotMinute] = startTime.split(':').map(Number)
        
        // Include slot only if it starts in the future (with 30-minute buffer)
        if (slotHour > currentHour) return true
        if (slotHour === currentHour && slotMinute > currentMinute + 30) return true
        return false
      })
    }
    
    // If no slots available for today, return empty array
    if (isToday && availableSlotsForDay.length === 0) {
      return res.json([])
    }
    
    // Count bookings for each slot
    const bookingCounts = await InspectionBooking.aggregate([
      {
        $match: {
          appointmentDate: new Date(date),
          status: { $nin: ['Cancelled'] }
        }
      },
      {
        $group: {
          _id: '$appointmentTimeSlot',
          count: { $sum: 1 }
        }
      }
    ])
    
    const availableSlots = availableSlotsForDay.map(slot => {
      const slotData = bookingCounts.find(b => b._id === slot)
      const bookedCount = slotData ? slotData.count : 0
      return {
        slot,
        available: bookedCount < 4,
        spotsLeft: 4 - bookedCount
      }
    })
    
    res.json(availableSlots)
  } catch (error) {
    console.error('Error fetching slots:', error)
    res.status(500).json({ error: error.message })
  }
}

// ==================== INSPECTION REPORT ENDPOINTS ====================

// Create inspection report
exports.createReport = async (req, res) => {
  try {
    const reportData = req.body
    
    // Verify booking exists
    const booking = await InspectionBooking.findById(reportData.bookingId)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    
    const report = new InspectionReport(reportData)
    
    // Calculate score
    report.calculateScore()
    
    await report.save()
    
    // Update booking with report reference and status
    booking.inspectionReportId = report._id
    booking.status = 'Completed'
    booking.completedAt = new Date()
    
    // Mark inspector token as used (if it was used)
    if (booking.inspectorToken) {
      booking.inspectorTokenUsed = true
    }
    
    await booking.save()

    
    res.status(201).json({ 
      message: 'Inspection report created successfully', 
      report 
    })
  } catch (error) {
    console.error('Error creating report:', error)
    res.status(400).json({ error: error.message })
  }
}

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const { minScore, maxScore, grade, sentToAuction } = req.query
    
    let query = {}
    
    if (minScore || maxScore) {
      query.overallScore = {}
      if (minScore) query.overallScore.$gte = parseInt(minScore)
      if (maxScore) query.overallScore.$lte = parseInt(maxScore)
    }
    
    if (grade) {
      query.overallGrade = grade
    }
    
    if (sentToAuction !== undefined) {
      query.sentToAuction = sentToAuction === 'true'
    }
    
    const reports = await InspectionReport.find(query)
      .populate('bookingId')
      .sort({ createdAt: -1 })
    
    res.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get public report by ID (Sanitized for sharing)
exports.getPublicReport = async (req, res) => {
  try {
    const report = await InspectionReport.findById(req.params.id)
      .populate('bookingId', 'brand model year variant fuelType transmission color registrationNumber')
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }
    
    // Hide sensitive inspector info for public view if needed, 
    // but usually inspector name is fine. 
    // Definitely hide customer details which are in bookingId (we only selected car details above).

    res.json(report)
  } catch (error) {
    console.error('Error fetching public report:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get report by ID (Admin/Dealer full access)
exports.getReportById = async (req, res) => {
  try {
    const report = await InspectionReport.findById(req.params.id)
      .populate('bookingId')
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }
    
    res.json(report)
  } catch (error) {
    console.error('Error fetching report:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get report by booking ID
exports.getReportByBookingId = async (req, res) => {
  try {
    const report = await InspectionReport.findOne({ bookingId: req.params.bookingId })
      .populate('bookingId')
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found for this booking' })
    }
    
    res.json(report)
  } catch (error) {
    console.error('Error fetching report:', error)
    res.status(500).json({ error: error.message })
  }
}

// Update inspection report
exports.updateReport = async (req, res) => {
  try {
    const report = await InspectionReport.findById(req.params.id)
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }
    
    // Update fields
    Object.assign(report, req.body)
    
    // Recalculate score
    report.calculateScore()
    
    await report.save()
    
    res.json({ message: 'Report updated successfully', report })
  } catch (error) {
    console.error('Error updating report:', error)
    res.status(500).json({ error: error.message })
  }
}

// Mark report as sent to auction
exports.sendToAuction = async (req, res) => {
  try {
    const { id } = req.params
    
    const report = await InspectionReport.findById(id)
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }
    
    if (report.sentToAuction) {
      return res.status(400).json({ error: 'Report already sent to auction' })
    }
    
    report.sentToAuction = true
    await report.save()
    
    // TODO: Create auction entry (Phase 2)
    
    res.json({ 
      message: 'Report marked for auction. Auction will be created shortly.',
      report 
    })
  } catch (error) {
    console.error('Error sending to auction:', error)
    res.status(500).json({ error: error.message })
  }
}

// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const report = await InspectionReport.findByIdAndDelete(req.params.id)
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }
    
    // Remove reference from booking
    await InspectionBooking.findByIdAndUpdate(
      report.bookingId,
      { $unset: { inspectionReportId: 1 } }
    )
    
    res.json({ message: 'Report deleted successfully' })
  } catch (error) {
    console.error('Error deleting report:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get booking by inspector token (public route)
exports.getBookingByToken = async (req, res) => {
  try {
    const { token } = req.params
    
    const booking = await InspectionBooking.findOne({ inspectorToken: token })
    
    if (!booking) {
      return res.status(404).json({ error: 'Invalid token. Booking not found.' })
    }
    
    // Check if token has expired
    if (new Date() > new Date(booking.inspectorTokenExpiry)) {
      return res.status(401).json({ 
        error: 'Token has expired. Please contact admin for a new link.',
        expired: true
      })
    }
    
    // Check if token has already been used
    if (booking.inspectorTokenUsed) {
      return res.status(410).json({ 
        error: 'This link has already been used. Report has been submitted.',
        used: true
      })
    }
    
    // Return booking data (without sensitive fields)
    res.json({
      _id: booking._id,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      registrationNumber: booking.registrationNumber,
      brand: booking.brand,
      model: booking.model,
      variant: booking.variant,
      year: booking.year,
      kmDriven: booking.kmDriven,
      fuelType: booking.fuelType,
      transmissionType: booking.transmissionType,
      appointmentDate: booking.appointmentDate,
      appointmentTimeSlot: booking.appointmentTimeSlot,
      inspectionLocation: booking.inspectionLocation,
      assignedInspector: booking.assignedInspector,
      status: booking.status
    })
  } catch (error) {
    console.error('Error fetching booking by token:', error)
    res.status(500).json({ error: error.message })
  }
}

// Regenerate inspector token (admin only)
exports.regenerateInspectorToken = async (req, res) => {
  try {
    const { id } = req.params
    
    const booking = await InspectionBooking.findById(id)
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    
    if (!booking.assignedInspector?.name) {
      return res.status(400).json({ error: 'No inspector assigned to this booking' })
    }
    
    // Generate new token
    const inspectorToken = crypto.randomBytes(32).toString('hex')
    const inspectorTokenExpiry = new Date()
    inspectorTokenExpiry.setDate(inspectorTokenExpiry.getDate() + 7)
    
    booking.inspectorToken = inspectorToken
    booking.inspectorTokenExpiry = inspectorTokenExpiry
    booking.inspectorTokenUsed = false
    
    await booking.save()
    
    const inspectorLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/inspector/report/create?token=${inspectorToken}`
    
    res.json({
      message: 'Inspector token regenerated successfully',
      booking,
      inspectorLink,
      tokenExpiry: inspectorTokenExpiry
    })
  } catch (error) {
    console.error('Error regenerating token:', error)
    res.status(500).json({ error: error.message })
  }
}
