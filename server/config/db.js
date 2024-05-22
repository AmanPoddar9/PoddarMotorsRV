const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://suryaansh2002:suryaansh2002@cluster0.iyrbdvi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'  )
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = connectDB
