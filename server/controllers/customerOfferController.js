const CustomerOffer = require('../models/CustomerOffer')
const Listing = require('../models/listing')
const { sendEvent } = require('../services/facebookCAPIService');

// Create a new customer offer
exports.createCustomerOffer = async (req, res) => {
  try {
    const { name, mobile, email, offerPrice, listingId } = req.body

    // Validate required fields
    if (!name || !mobile || !offerPrice || !listingId) {
      return res.status(400).json({
        error: 'Name, mobile, offer price, and listing ID are required',
      })
    }

    // Verify listing exists
    const listing = await Listing.findById(listingId)
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }

    // Create the offer
    const customerOffer = new CustomerOffer({
      name,
      mobile,
      email,
      offerPrice,
      listing: listingId,
    })

    await customerOffer.save()

    // [Meta CAPI] Fire Lead Event (Buyer Offer)
    sendEvent('Lead', {
        name: name,
        email: email,
        phone: mobile,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
    }, {
        content_name: 'Make an Offer',
        content_category: 'Buyer',
        content_ids: [listingId],
        value: offerPrice,
        currency: 'INR'
    });

    res.status(201).json({
      message: 'Offer submitted successfully',
      offer: customerOffer,
    })
  } catch (error) {
    console.error('Error creating customer offer:', error)
    res.status(500).json({ error: 'Failed to submit offer' })
  }
}

// Get all customer offers (admin only)
exports.getAllCustomerOffers = async (req, res) => {
  try {
    const offers = await CustomerOffer.find()
      .populate('listing', 'brand model variant year price images')
      .sort({ createdAt: -1 })

    res.status(200).json(offers)
  } catch (error) {
    console.error('Error fetching customer offers:', error)
    res.status(500).json({ error: 'Failed to fetch offers' })
  }
}

// Update offer status (admin only)
exports.updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const offer = await CustomerOffer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('listing', 'brand model variant year price')

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' })
    }

    res.status(200).json(offer)
  } catch (error) {
    console.error('Error updating offer status:', error)
    res.status(500).json({ error: 'Failed to update offer status' })
  }
}

// Delete an offer (admin only)
exports.deleteCustomerOffer = async (req, res) => {
  try {
    const { id } = req.params

    const offer = await CustomerOffer.findByIdAndDelete(id)

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' })
    }

    res.status(200).json({ message: 'Offer deleted successfully' })
  } catch (error) {
    console.error('Error deleting offer:', error)
    res.status(500).json({ error: 'Failed to delete offer' })
  }
}
