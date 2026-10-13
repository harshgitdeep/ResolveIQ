import { pool } from '../config/db.js';

export const getTickets = async (req, res, next) => {
  try {
    const query = `
      SELECT
        t.id,
        t.ticket_number,
        t.subject,
        t.description,
        t.status,
        t.priority,
        t.resolution_type,
        t.created_at,
        t.updated_at,
        c.id AS customer_id,
        u.name AS customer_name,
        u.email AS customer_email,
        o.order_number
      FROM tickets t
      JOIN customers c ON c.id = t.customer_id
      LEFT JOIN users u ON u.id = c.user_id
      LEFT JOIN orders o ON o.id = t.order_id
      ORDER BY t.created_at DESC;
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
