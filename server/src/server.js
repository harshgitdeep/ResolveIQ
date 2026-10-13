import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import pc from 'picocolors';
import { config } from './config/index.js';
import { testConnection } from './config/db.js';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', apiRouter);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'ResolveIQ Backend API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server and verify database connection
app.listen(config.port, async () => {
  console.log(pc.yellow('\n\n\n----------------- Server Start -----------------\n'));
  console.log(pc.yellow(`✔ Server listening in ${config.nodeEnv} mode at `) + pc.green(`http://localhost:${config.port}`));
  console.log(pc.yellow('\n-------------------------------------------------\n\n\n'));
  if (config.databaseUrl) {
    await testConnection();
  } else {
    console.warn(pc.yellow('\n⚠ DATABASE_URL is not set in environment.'));
  }
});
