const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to get all users
router.get('/users', adminController.getAllUsers);

// Route to get a user by ID
router.get('/users/:userId', adminController.getUserById);

// Route to delete a user by ID
router.delete('/users/:userId', adminController.deleteUserById);

module.exports = router;
