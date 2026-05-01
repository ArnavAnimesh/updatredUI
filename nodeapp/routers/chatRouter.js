const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateToken } = require('../authUtils');

// Route for sending a message to Coster (requires authentication to get user context)
router.post('/message', validateToken, chatController.handleChat);

module.exports = router;
