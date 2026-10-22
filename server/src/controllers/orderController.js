import { pool } from '../config/db.js';

export const getOrders = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        o.id,
        o.order_number,
        o.customer_id,
        o.status,
        o.total_amount,
        o.currency,
        o.tracking_number,
        o.estimated_delivery_at,
        o.created_at,
        o.updated_at,
        u.name AS customer_name,
        u.email AS customer_email,
        r.id AS refund_id,
        r.amount AS refund_amount,
        r.status AS refund_status
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      JOIN users u ON u.id = c.user_id
      LEFT JOIN refunds r ON r.order_id = o.id
      ORDER BY o.created_at DESC;
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

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);

    const query = `
      SELECT 
        o.id,
        o.order_number,
        o.customer_id,
        o.status,
        o.total_amount,
        o.currency,
        o.tracking_number,
        o.estimated_delivery_at,
        o.created_at,
        o.updated_at,
        u.name AS customer_name,
        u.email AS customer_email,
        c.phone AS customer_phone,
        r.id AS refund_id,
        r.amount AS refund_amount,
        r.status AS refund_status,
        r.reason AS refund_reason
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      JOIN users u ON u.id = c.user_id
      LEFT JOIN refunds r ON r.order_id = o.id
      WHERE ${isUUID ? 'o.id = $1' : 'o.order_number = $1'}
      LIMIT 1;
    `;
    const result = await pool.query(query, [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Order not found with identifier '${orderId}'`,
      });
    }

    const order = result.rows[0];

    // Find any tickets related to this order
    const ticketsRes = await pool.query(
      `SELECT id, ticket_number, subject, status, priority, created_at FROM tickets WHERE order_id = $1;`,
      [order.id]
    );

    return res.status(200).json({
      success: true,
      data: {
        ...order,
        tickets: ticketsRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
