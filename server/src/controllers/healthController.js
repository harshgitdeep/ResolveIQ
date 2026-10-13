import { query } from '../config/db.js';

export const getHealth = async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const result = await query('SELECT NOW()');
    if (result && result.rows.length > 0) {
      dbStatus = 'connected';
    }
  } catch (error) {
    dbStatus = `error: ${error.message}`;
  }

  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    message: 'ResolveIQ Backend API is operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
