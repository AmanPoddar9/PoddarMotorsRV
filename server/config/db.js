const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    
    await mongoose.connect('mongodb+srv://amanpoddar9:poddarmotorsrv@cluster0.9tbfrft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = connectDB
