const express = require('express');
const router = express.Router();

const { authLimiter } = require('../middlewares/rateLimiter');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
  deleteAccountValidator,
} = require('../validators/authValidator');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/authController');

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidator, validate, updateProfile);
router.put('/change-password', protect, changePasswordValidator, validate, changePassword);
router.delete('/account', protect, deleteAccountValidator, validate, deleteAccount);

module.exports = router;
