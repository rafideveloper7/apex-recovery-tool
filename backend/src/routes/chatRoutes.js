const express = require('express');
const { chatWithAI, getUserChatHistory } = require('../controllers/chatController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', chatWithAI);
router.get('/history', authMiddleware, getUserChatHistory);

module.exports = router;