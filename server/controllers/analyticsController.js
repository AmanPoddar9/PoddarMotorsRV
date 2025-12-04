const InspectionBooking = require('../models/InspectionBooking');
const InspectionReport = require('../models/InspectionReport');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const Dealer = require('../models/Dealer');

// Get overview statistics
exports.getOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Total Inspections (This Month vs Last Month)
    const inspectionsThisMonth = await InspectionBooking.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const inspectionsLastMonth = await InspectionBooking.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
    });

    // Total Auctions
    const activeAuctions = await Auction.countDocuments({ status: 'Active' });
    const completedAuctions = await Auction.countDocuments({ status: 'Completed' });
    const totalAuctions = await Auction.countDocuments();

    // Total Dealers
    const activeDealers = await Dealer.countDocuments({ status: 'Approved' });
    const pendingDealers = await Dealer.countDocuments({ status: 'Pending' });

    // Total Revenue (inspection fees)
    const paidBookings = await InspectionBooking.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);

    res.json({
      inspections: {
        thisMonth: inspectionsThisMonth,
        lastMonth: inspectionsLastMonth,
        change: inspectionsLastMonth > 0 
          ? Math.round(((inspectionsThisMonth - inspectionsLastMonth) / inspectionsLastMonth) * 100)
          : 0
      },
      auctions: {
        active: activeAuctions,
        completed: completedAuctions,
        total: totalAuctions
      },
      dealers: {
        active: activeDealers,
        pending: pendingDealers,
        total: activeDealers + pendingDealers
      },
      revenue: {
        total: totalRevenue,
        currency: 'INR'
      }
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get conversion funnel
exports.getFunnel = async (req, res) => {
  try {
    const totalBookings = await InspectionBooking.countDocuments();
    const completedInspections = await InspectionBooking.countDocuments({ status: 'Completed' });
    const reportsCreated = await InspectionReport.countDocuments();
    const sentToAuction = await InspectionReport.countDocuments({ sentToAuction: true });
    const activeAuctions = await Auction.countDocuments({ status: { $in: ['Active', 'Completed'] } });
    const wonAuctions = await Auction.countDocuments({ winnerId: { $exists: true, $ne: null } });

    res.json({
      funnel: [
        { stage: 'Bookings', count: totalBookings },
        { stage: 'Completed', count: completedInspections },
        { stage: 'Reports', count: reportsCreated },
        { stage: 'Sent to Auction', count: sentToAuction },
        { stage: 'Active Auctions', count: activeAuctions },
        { stage: 'Won', count: wonAuctions }
      ],
      conversionRate: totalBookings > 0 
        ? Math.round((wonAuctions / totalBookings) * 100)
        : 0
    });
  } catch (error) {
    console.error('Error fetching funnel:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get dealer analytics
exports.getDealerAnalytics = async (req, res) => {
  try {
    // Top dealers by bid count
    const topBidders = await Bid.aggregate([
      {
        $group: {
          _id: '$dealerId',
          bidCount: { $sum: 1 },
          totalBidAmount: { $sum: '$amount' }
        }
      },
      { $sort: { bidCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'dealers',
          localField: '_id',
          foreignField: '_id',
          as: 'dealer'
        }
      },
      { $unwind: '$dealer' },
      {
        $project: {
          name: '$dealer.name',
          company: '$dealer.company',
          bidCount: 1,
          totalBidAmount: 1
        }
      }
    ]);

    // Top winners
    const topWinners = await Auction.aggregate([
      { $match: { winnerId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$winnerId',
          winCount: { $sum: 1 },
          totalWinAmount: { $sum: '$currentBid' }
        }
      },
      { $sort: { winCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'dealers',
          localField: '_id',
          foreignField: '_id',
          as: 'dealer'
        }
      },
      { $unwind: '$dealer' },
      {
        $project: {
          name: '$dealer.name',
          company: '$dealer.company',
          winCount: 1,
          totalWinAmount: 1
        }
      }
    ]);

    res.json({
      topBidders,
      topWinners
    });
  } catch (error) {
    console.error('Error fetching dealer analytics:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Revenue by day (inspection fees)
    const dailyRevenue = await InspectionBooking.aggregate([
      {
        $match: {
          paymentStatus: 'Paid',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Total revenue breakdown
    const totalInspectionRevenue = await InspectionBooking.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      dailyRevenue,
      totalInspectionRevenue: totalInspectionRevenue[0]?.total || 0,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get car analytics
exports.getCarAnalytics = async (req, res) => {
  try {
    // Average auction price by brand
    const avgPriceByBrand = await Auction.aggregate([
      { $match: { winnerId: { $exists: true, $ne: null } } },
      {
        $lookup: {
          from: 'inspectionreports',
          localField: 'inspectionReportId',
          foreignField: '_id',
          as: 'report'
        }
      },
      { $unwind: '$report' },
      {
        $lookup: {
          from: 'inspectionbookings',
          localField: 'report.bookingId',
          foreignField: '_id',
          as: 'booking'
        }
      },
      { $unwind: '$booking' },
      {
        $group: {
          _id: '$booking.brand',
          avgPrice: { $avg: '$currentBid' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgPrice: -1 } }
    ]);

    // Most popular car types
    const popularCars = await InspectionBooking.aggregate([
      {
        $group: {
          _id: { brand: '$brand', model: '$model' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      avgPriceByBrand,
      popularCars
    });
  } catch (error) {
    console.error('Error fetching car analytics:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get recent bookings, auctions, and bids
    const recentBookings = await InspectionBooking.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 3)
      .select('brand model status createdAt customerName');

    const recentAuctions = await Auction.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 3)
      .populate('inspectionReportId')
      .select('status currentBid createdAt');

    const recentBids = await Bid.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 3)
      .populate('dealerId', 'name company')
      .select('amount createdAt');

    // Combine and format
    const activity = [];

    recentBookings.forEach(b => {
      activity.push({
        type: 'booking',
        message: `New inspection booked: ${b.brand} ${b.model}`,
        timestamp: b.createdAt
      });
    });

    recentAuctions.forEach(a => {
      activity.push({
        type: 'auction',
        message: `Auction ${a.status}: Current bid ₹${a.currentBid}`,
        timestamp: a.createdAt
      });
    });

    recentBids.forEach(b => {
      activity.push({
        type: 'bid',
        message: `${b.dealerId?.name} placed bid: ₹${b.amount}`,
        timestamp: b.createdAt
      });
    });

    // Sort by timestamp
    activity.sort((a, b) => b.timestamp - a.timestamp);

    res.json({ activity: activity.slice(0, parseInt(limit)) });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: error.message });
  }
};
