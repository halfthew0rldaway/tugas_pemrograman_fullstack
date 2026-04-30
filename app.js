const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

module.exports = app;
