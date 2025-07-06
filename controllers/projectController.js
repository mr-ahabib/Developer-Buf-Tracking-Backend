const { Project } = require('../models');  // Make sure this path is correct

exports.createProject = async (req, res) => {
  try {
    const email = req.user.email; // get email from verified JWT user (authMiddleware)
    const { name, details, assignedTester } = req.body;

    const project = await Project.create({ email, name, details, assignedTester });
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    res.status(500).json({ error: 'Project creation failed', details: err.message });
  }
};
