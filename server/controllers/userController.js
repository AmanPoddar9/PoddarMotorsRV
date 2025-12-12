const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Get all agents (or potential agents)
exports.getAgents = async (req, res) => {
    try {
        // Fetch admins and insurance agents
        // If roles aren't strictly set yet, we might just fetch all for now, 
        // but let's try to filter if possible.
        // For now, return all users so Admin can assign anyone.
        const agents = await User.find({}, 'name email role _id');
        res.json(agents);
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ message: 'Error fetching agents' });
    }
};

// Create User (Admin only likely)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Basic validation
        if (!email || !password) return res.status(400).json({ message: 'Email/Password required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ name, email, role });
        await user.setPassword(password);
        await user.save();

        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

