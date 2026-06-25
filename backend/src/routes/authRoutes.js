const express = require('express');
const { registerUser, loginUser, getMe, googleLogin } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', authMiddleware, getMe);

module.exports = router;