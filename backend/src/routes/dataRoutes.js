const express = require('express');
const { submitCheckin, getUserCheckins, getLatestCheckin, getStats } = require('../controllers/dataController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/checkin', authMiddleware, submitCheckin);
router.get('/checkins', authMiddleware, getUserCheckins);
router.get('/checkins/latest', authMiddleware, getLatestCheckin);
router.get('/stats', authMiddleware, getStats);

module.exports = router;