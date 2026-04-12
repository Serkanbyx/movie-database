const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');

const { PORT, CLIENT_URL } = require('./config/env');
const connectDB = require('./config/db');
const { globalLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

const app = express();

const startServer = async () => {
  await connectDB();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(hpp());

  app.use('/api', globalLimiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/list', listRoutes);
  app.use('/api/movies', tmdbRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
