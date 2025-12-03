const socketIo = require('socket.io');
const Auction = require('./models/Auction');
const Bid = require('./models/Bid');

let io;

exports.init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // Join auction room
    socket.on('join_auction', (auctionId) => {
      socket.join(auctionId);
      console.log(`Socket ${socket.id} joined auction ${auctionId}`);
    });

    // Handle new bid
    socket.on('place_bid', async (data) => {
      try {
        const { auctionId, dealerId, amount, dealerName } = data;
        
        // Broadcast new bid to everyone in the room
        io.to(auctionId).emit('new_bid', {
          amount,
          dealerName,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Socket bid error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

exports.getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
