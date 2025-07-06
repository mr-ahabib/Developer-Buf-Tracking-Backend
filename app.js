require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/routes');
const projectRoutes = require('./routes/routes');

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', projectRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
