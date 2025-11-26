const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    
    // Temporarily hardcoding URI to debug Vercel env var issue
    const uri = 'mongodb+srv://amanpoddar9:poddarmotorsrv@cluster0.9tbfrft.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(error.message)
    console.error('MongoDB Connection Error:', error.message)
    // process.exit(1) - Removed to keep server alive for debugging
  }
}

module.exports = connectDB
