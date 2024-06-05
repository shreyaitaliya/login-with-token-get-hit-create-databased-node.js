const express = require('express');
const router = express.Router();
const authenticateToken = require('../middelware/jwtToken'); // Corrected path
const { createSequelizeInstance } = require('../config/db');
const fs = require('fs').promises;
const path = require('path');
const { DataTypes } = require('sequelize');

// Controllers (assuming userControllers.js exists)
const userController = require('../controllers/usercontrollers');


// Routes
router.post('/adduser', userController.adduser);
router.post('/login', userController.login);
router.get('/userdetails', authenticateToken, userController.userdetails);
router.post('/categoryadd', authenticateToken, userController.categoryadd);
router.post('/subcategoryadd', authenticateToken, userController.subcategoryadd);



module.exports = router