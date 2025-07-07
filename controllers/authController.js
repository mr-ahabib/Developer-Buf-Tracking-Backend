const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role, isVerified: false });

    // ✅ Create a verification token valid for 10 minutes
    const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const verifyLink = `http://localhost:${process.env.PORT}/api/verify?token=${verifyToken}`;

    const html = `
      <h3>Verify Your Email</h3>
      <p>Click the link below to verify and login:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `;

    await sendEmail(email, 'Verify your Bug Tracker account', html);

    res.status(201).json({ message: 'Signup successful. Please check your email to verify.' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed', detail: err.message });
  }
};



exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // ✅ Auto-login after verification
    const authToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Email verified. You are now logged in.',
      token: authToken,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token', detail: err.message });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message });
  }
};
