require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - allow all origins for development
app.use(cors());

// JSON body parser
app.use(express.json());

// Log requests for diagnostics
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Root route for API health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SPARK.CO API Server is running.',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);

// Catch-all 404 for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({ error: `Endpoint ${req.method} ${req.path} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start the Express server on specified port, bound to 0.0.0.0
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SPARK.CO API server successfully listening on http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;
