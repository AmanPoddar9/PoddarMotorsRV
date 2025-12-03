const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

// Auction Management
router.post('/', auctionController.createAuction);
router.get('/', auctionController.getAuctions);
router.get('/:id', auctionController.getAuctionById);

// Bidding
router.post('/bid', auctionController.placeBid);
router.get('/:id/bids', auctionController.getAuctionBids);

module.exports = router;
