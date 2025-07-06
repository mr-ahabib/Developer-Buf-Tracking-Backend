const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  // ✅ Support Bearer <token> format
  const token = authHeader.split(' ')[1]; // extracts token from "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) return res.status(401).json({ error: 'Invalid token user' });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized token' });
  }
};
