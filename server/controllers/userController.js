const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.signup = async (req, res) => {
  try {
    const { username, password, access_level } = req.body
    const user = new User({ username, password, access_level })
    await user.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      throw new Error('Invalid username')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('Invalid password')
    }
    const token = jwt.sign(
      { userId: user._id, access_level: user.access_level },
      process.env.JWT_SECRET || 'RealValueSecretKey',
      { expiresIn: '7d' }
    )
    
    // Set httpOnly cookie
    res.cookie('auth', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    res.json({ message: 'Login successful', success: true })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}
