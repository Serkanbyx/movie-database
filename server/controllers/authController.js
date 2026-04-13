const User = require('../models/User');
const MovieItem = require('../models/MovieItem');
const generateToken = require('../utils/generateToken');

const formatUserResponse = (user, token) => ({
  success: true,
  data: {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
    token,
  },
});

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      const error = new Error(`${field} is already taken`);
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.status(201).json(formatUserResponse(user, token));
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);

    res.status(200).json(formatUserResponse(user, token));
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({ success: true, data: { token } });
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const error = new Error('Password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    await MovieItem.deleteMany({ userId: req.user._id });

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
};
