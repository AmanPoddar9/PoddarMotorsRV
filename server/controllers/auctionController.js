const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const Dealer = require('../models/Dealer');
const InspectionReport = require('../models/InspectionReport');

// Create a new auction
exports.createAuction = async (req, res) => {
  try {
    const { inspectionReportId, startTime, endTime, startingBid, reservePrice } = req.body;

    // Fetch car details from report
    const report = await InspectionReport.findById(inspectionReportId).populate('bookingId');
    if (!report) {
      return res.status(404).json({ error: 'Inspection report not found' });
    }

    const auction = new Auction({
      inspectionReportId,
      carDetails: {
        brand: report.bookingId.brand,
        model: report.bookingId.model,
        variant: report.bookingId.variant,
        year: report.bookingId.year,
        registrationNumber: report.bookingId.registrationNumber
      },
      startTime,
      endTime,
      startingBid,
      currentBid: startingBid,
      reservePrice
    });

    await auction.save();
    res.status(201).json(auction);
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ error: 'Failed to create auction' });
  }
};

// Get all auctions (with filters)
exports.getAuctions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const auctions = await Auction.find(query).sort({ endTime: 1 });
    res.json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
};

// Get single auction details
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('inspectionReportId')
      .populate('winner', 'name businessName');
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch auction' });
  }
};

// Place a bid
exports.placeBid = async (req, res) => {
  try {
    const { auctionId, dealerId, amount } = req.body;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    if (auction.status !== 'Live') {
      return res.status(400).json({ error: 'Auction is not live' });
    }

    if (new Date() > new Date(auction.endTime)) {
      return res.status(400).json({ error: 'Auction has ended' });
    }

    if (amount <= auction.currentBid) {
      return res.status(400).json({ error: 'Bid must be higher than current bid' });
    }

    // Create bid
    const bid = new Bid({
      auctionId,
      dealerId,
      amount
    });
    await bid.save();

    // Update auction
    auction.currentBid = amount;
    auction.totalBids += 1;
    
    // Auto-extend if bid placed in last 2 minutes
    const timeRemaining = new Date(auction.endTime) - new Date();
    if (timeRemaining < 2 * 60 * 1000) {
      auction.endTime = new Date(new Date(auction.endTime).getTime() + 2 * 60 * 1000);
    }

    await auction.save();

    res.json({ success: true, bid, newEndTime: auction.endTime });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
};

// Get bids for an auction
exports.getAuctionBids = async (req, res) => {
  try {
    const bids = await Bid.find({ auctionId: req.params.id })
      .sort({ amount: -1 })
      .populate('dealerId', 'name businessName'); // Only show limited dealer info
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
};
