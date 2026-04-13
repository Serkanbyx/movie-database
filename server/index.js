const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const { version } = require('./package.json');
const { PORT, CLIENT_URL, NODE_ENV } = require('./config/env');
const connectDB = require('./config/db');
const swaggerSpec = require('./config/swagger');
const { globalLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

const app = express();

const startServer = async () => {
  await connectDB();

  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(hpp());

  if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.use('/api', globalLimiter);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Movie Database API Docs',
  }));

  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Movie Database API</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: #0a0a1a;
            color: #e8e8f0;
            overflow: hidden;
          }

          body::before {
            content: '';
            position: fixed;
            inset: 0;
            background:
              radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(234, 179, 8, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
          }

          body::after {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-conic-gradient(
              rgba(255, 255, 255, 0.01) 0deg 1deg,
              transparent 1deg 60deg
            );
            pointer-events: none;
            z-index: 0;
          }

          .container {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 3rem 2.5rem;
            max-width: 520px;
            width: 90%;
            background: linear-gradient(145deg, rgba(20, 20, 40, 0.85), rgba(15, 15, 30, 0.95));
            border: 1px solid rgba(139, 92, 246, 0.15);
            border-radius: 24px;
            backdrop-filter: blur(20px);
            box-shadow:
              0 0 80px rgba(139, 92, 246, 0.06),
              0 25px 50px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.04);
          }

          .film-strip {
            display: flex;
            justify-content: center;
            gap: 6px;
            margin-bottom: 1.5rem;
          }

          .film-strip span {
            width: 8px;
            height: 8px;
            border-radius: 2px;
            background: rgba(234, 179, 8, 0.5);
            box-shadow: 0 0 6px rgba(234, 179, 8, 0.3);
          }

          .film-strip span:nth-child(2n) {
            background: rgba(139, 92, 246, 0.5);
            box-shadow: 0 0 6px rgba(139, 92, 246, 0.3);
          }

          h1 {
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #a78bfa 70%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: none;
            margin-bottom: 0.5rem;
          }

          .version {
            font-size: 0.85rem;
            color: rgba(167, 139, 250, 0.6);
            font-weight: 500;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 2rem;
          }

          .links {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 2.5rem;
          }

          .btn-primary, .btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.85rem 1.5rem;
            border-radius: 14px;
            font-size: 0.95rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            letter-spacing: 0.3px;
          }

          .btn-primary {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: #fff;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.45);
          }

          .btn-secondary {
            background: rgba(234, 179, 8, 0.08);
            color: #fbbf24;
            border: 1px solid rgba(234, 179, 8, 0.2);
          }

          .btn-secondary:hover {
            background: rgba(234, 179, 8, 0.15);
            border-color: rgba(234, 179, 8, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(234, 179, 8, 0.15);
          }

          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), rgba(234, 179, 8, 0.2), transparent);
            margin-bottom: 1.5rem;
          }

          footer.sign {
            font-size: 0.8rem;
            color: rgba(200, 200, 220, 0.4);
            letter-spacing: 0.5px;
          }

          footer.sign a {
            color: rgba(167, 139, 250, 0.7);
            text-decoration: none;
            transition: color 0.25s ease;
          }

          footer.sign a:hover {
            color: #a78bfa;
          }

          @media (max-width: 480px) {
            .container { padding: 2rem 1.5rem; }
            h1 { font-size: 1.6rem; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="film-strip">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span>
          </div>
          <h1>Movie Database API</h1>
          <p class="version">v${version}</p>
          <div class="links">
            <a href="/api-docs" class="btn-primary">API Documentation</a>
            <a href="/api/health" class="btn-secondary">Health Check</a>
            <a href="${CLIENT_URL}" class="btn-secondary" target="_blank" rel="noopener noreferrer">Open Client App</a>
          </div>
          <div class="divider"></div>
          <footer class="sign">
            Created by
            <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
            |
            <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
          </footer>
        </div>
      </body>
      </html>
    `);
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/list', listRoutes);
  app.use('/api/movies', tmdbRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
  });

  app.all('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
