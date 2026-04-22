const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ message: 'Identifier and password are required' });

    // Accept username, email or phone number
    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    }).select('+password');

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials. Please check your username/email/phone and password.' });

    if (!user.isEnabled)
      return res.status(403).json({ message: 'Your account has been disabled. Contact admin.' });

    const token = signToken(user._id);
    res.json({ token, role: user.role, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
