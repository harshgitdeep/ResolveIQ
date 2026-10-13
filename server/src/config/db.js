import pg from 'pg';
import pc from 'picocolors';
import { config } from './index.js';

const { Pool } = pg;

const isNeonOrRemote =
  config.databaseUrl &&
  (config.databaseUrl.includes('neon.tech') ||
    config.databaseUrl.includes('sslmode=require'));

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: isNeonOrRemote ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (err) => {
  console.error(pc.red('Unexpected error on idle PostgreSQL client:'), err);
});

export const query = (text, params) => pool.query(text, params);

export const testConnection = async () => {
  try {
    const res = await query('SELECT NOW() as current_time, current_database() as db_name');
    console.log(pc.magenta('\n\n\n------------- PostgreSQL Connection Success -------------\n'));
    console.log(pc.green(`✔ Connected to Neon PostgreSQL database: ${pc.bold(`"${res.rows[0].db_name}"`)} at ${res.rows[0].current_time}`));
    console.log(pc.magenta('\n--------------------------------------------------\n\n\n'));
    return true;
  } catch (error) {
    console.error(pc.red(`✖ PostgreSQL connection error: ${error.message}`));
    return false;
  }
};
