const express = require('express');
const userRoutes = require('./routes/user.routes');
const app = express();

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.use('/api/users', userRoutes);

module.exports = app;
