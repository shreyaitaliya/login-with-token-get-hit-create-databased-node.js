// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontrollers');

router.post('/adduser', userController.adduser);
router.post('/login', userController.login);

module.exports = router;
