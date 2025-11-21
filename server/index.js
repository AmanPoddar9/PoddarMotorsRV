const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()
const userRoutes = require('./routes/userRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const testimonialsRoutes = require('./routes/testimonialsRoutes')
const offersRoutes = require('./routes/offersRoutes')
const featuresRoutes = require('./routes/featuresRoutes')
const listingRoutes = require('./routes/listingRoutes')
const sellRequestRoutes = require('./routes/sellRequestRoutes')
const scrapRequestRoutes = require('./routes/scrapRequestRoutes')

const cors = require('cors')

const compression = require("compression");

const app = express()
const PORT = process.env.PORT || 5000

connectDB()
app.use(cors())

app.use(express.json())

app.use(compression());

app.get('/', (req, res) => {
  res.send('Real Value backend Server')
})
app.use('/api/user', userRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/testimonials', testimonialsRoutes)
app.use('/api/offers', offersRoutes)
app.use('/api/features', featuresRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/sellRequests', sellRequestRoutes)
app.use('/api/scrapRequests', scrapRequestRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
