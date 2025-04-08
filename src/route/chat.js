const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat');

router.post('/send', chatController.handleChat);

module.exports = router;
