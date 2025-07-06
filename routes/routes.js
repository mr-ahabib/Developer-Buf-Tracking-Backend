const express = require('express');
const router = express.Router();
const projectController=require('../controllers/projectController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/projects', authMiddleware, adminMiddleware, projectController.createProject);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
