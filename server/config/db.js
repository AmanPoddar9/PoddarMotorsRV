const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(error.message)
    console.error('MongoDB Connection Error:', error.message)
    // process.exit(1) - Removed to keep server alive for debugging
  }
}

module.exports = connectDB
