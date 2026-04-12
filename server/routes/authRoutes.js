const express = require('express');
const router = express.Router();

const { authLimiter } = require('../middlewares/rateLimiter');
const { protect } = require('../middlewares/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/authController');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
