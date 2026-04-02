import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { routes } from './routes/index.js';

const app = express();

// Security
app.use(helmet());
const allowedOrigins = config.frontendUrl === '*'
  ? true
  : config.frontendUrl.split(',').map(o => o.trim());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;
