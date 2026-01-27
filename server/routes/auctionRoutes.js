const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

const { requireAuth, requireRole } = require('../middleware/auth');
const { requireDealerAuth } = require('../middleware/dealerAuth');

// Auction Management
router.post('/', requireAuth, requireRole('admin', 'auctions.manage'), auctionController.createAuction);
router.get('/', auctionController.getAuctions);
router.get('/:id', auctionController.getAuctionById);

// Bidding
router.post('/bid', requireDealerAuth, auctionController.placeBid);
router.get('/:id/bids', requireAuth, requireRole('admin', 'auctions.manage'), auctionController.getAuctionBids);
router.post('/:id/end', requireAuth, requireRole('admin', 'auctions.manage'), auctionController.endAuction);

module.exports = router;
