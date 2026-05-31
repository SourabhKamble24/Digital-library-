const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bookRoutes = require('./routes/books');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const borrowRoutes = require('./routes/borrow');

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/borrow', borrowRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Digital Library Backend API is running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
