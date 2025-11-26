const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    
    // Temporarily hardcoding URI to debug Vercel env var issue
    const uri = 'mongodb+srv://suryaansh2002:suryaansh2002@cluster0.iyrbdvi.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = connectDB
