const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;