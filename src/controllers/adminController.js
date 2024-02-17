const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({}, { password: 0, mobileOTP: 0 });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch user by ID
        const user = await User.findById(userId, { password: 0, mobileOTP: 0 });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Delete user by ID
        await User.findByIdAndDelete(userId);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
