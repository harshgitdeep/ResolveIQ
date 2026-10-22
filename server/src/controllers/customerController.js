import { pool } from '../config/db.js';

export const getCustomers = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.user_id,
        c.phone,
        c.created_at,
        u.name,
        u.email,
        u.role,
        COALESCE((SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id), 0)::int AS total_orders,
        COALESCE((SELECT SUM(total_amount) FROM orders o WHERE o.customer_id = c.id), 0)::numeric AS total_spent,
        COALESCE((SELECT COUNT(*) FROM tickets t WHERE t.customer_id = c.id AND t.status != 'resolved'), 0)::int AS open_tickets
      FROM customers c
      JOIN users u ON u.id = c.user_id
      ORDER BY c.created_at ASC;
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

export const getCustomerById = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const query = `
      SELECT 
        c.id,
        c.user_id,
        c.phone,
        c.created_at,
        u.name,
        u.email,
        u.role,
        COALESCE((SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id), 0)::int AS total_orders,
        COALESCE((SELECT SUM(total_amount) FROM orders o WHERE o.customer_id = c.id), 0)::numeric AS total_spent,
        COALESCE((SELECT COUNT(*) FROM tickets t WHERE t.customer_id = c.id AND t.status != 'resolved'), 0)::int AS open_tickets
      FROM customers c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = $1 OR u.email = $1
      LIMIT 1;
    `;
    const result = await pool.query(query, [customerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Customer not found with identifier '${customerId}'`,
      });
    }

    const customer = result.rows[0];

    // Get orders for this customer
    const ordersRes = await pool.query(
      `SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC;`,
      [customer.id]
    );

    // Get tickets for this customer
    const ticketsRes = await pool.query(
      `SELECT t.*, o.order_number 
       FROM tickets t 
       LEFT JOIN orders o ON o.id = t.order_id 
       WHERE t.customer_id = $1 
       ORDER BY t.created_at DESC;`,
      [customer.id]
    );

    return res.status(200).json({
      success: true,
      data: {
        ...customer,
        orders: ordersRes.rows,
        tickets: ticketsRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
