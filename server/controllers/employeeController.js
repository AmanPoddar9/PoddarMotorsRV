const Employee = require('../models/Employee');
const User = require('../models/user');

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if employee with email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const newEmployee = new Employee(req.body);
    await newEmployee.save();

    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error);
    // Standardize error message for frontend
    const message = error.code === 11000 ? 'Email or Employee ID already exists' : error.message;
    res.status(500).json({ message, error: message });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { status, department } = req.query;
    let query = {};

    if (status) query.status = status;
    if (department) query.department = department;

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('user', 'name email role');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete employee (Soft delete preferred usually, but hard delete for now if requested)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add Document
exports.addDocument = async (req, res) => {
    try {
        const { title, url } = req.body;
        const employee = await Employee.findById(req.params.id);
        
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        employee.documents.push({ title, url });
        await employee.save();

        res.status(200).json({ message: 'Document added', employee });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Add Asset
exports.addAsset = async (req, res) => {
    try {
        const { itemName, identifier } = req.body;
        const employee = await Employee.findById(req.params.id);
        
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        employee.assets.push({ itemName, identifier });
        await employee.save();

        res.status(200).json({ message: 'Asset assigned', employee });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
