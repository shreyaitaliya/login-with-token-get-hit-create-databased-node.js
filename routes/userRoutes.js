const express = require('express');
const router = express.Router();
const authenticateToken = require('../middelware/jwtToken');
const userController = require('../controllers/usercontrollers');

// Routes
router.post('/master_host', userController.master_host);
// router.post('/adduser', userController.adduser);
router.post('/login', userController.login);
router.get('/userdetails', authenticateToken, userController.userdetails);
router.post('/categoryadd', authenticateToken, userController.categoryadd);
router.post('/subcategoryadd', authenticateToken, userController.subcategoryadd);

module.exports = router;
