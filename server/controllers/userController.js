const User = require('../models/user');

// Get all users (employees and admins)
// For the UI, we want to list everyone so the admin can manage them.
exports.getUsers = async (req, res) => {
  try {
    // Return necessary fields, exclude password hash
    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new employee
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, permissions, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = new User({
      name,
      email,
      username: req.body.username || email.split('@')[0], // Use email handle as default username
      role: role || 'employee', // Default to employee
      permissions: permissions || [],
      isActive: true
    });

    await newUser.setPassword(password);
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message || 'Server error creating user' });
  }
};

// Update user (permissions, active status, or password)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, permissions, role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (permissions) user.permissions = permissions;
    if (isActive !== undefined) user.isActive = isActive;

    // PASSWORD RESET LOGIC
    // If a new password is provided, hash it and save.
    if (password && password.trim() !== '') {
      await user.setPassword(password);
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self (simple check, frontend also handles this)
    if (req.user && req.user.id === id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Keep existing getAgents for backward compatibility if needed, or alias it
exports.getAgents = exports.getUsers;
