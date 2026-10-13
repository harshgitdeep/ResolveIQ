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

export const getTicketById = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    // Check whether ticketId is UUID or ticket_number (e.g. TKT-1041)
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ticketId);

    const ticketQuery = `
      SELECT
        t.id,
        t.ticket_number,
        t.subject,
        t.description,
        t.status,
        t.priority,
        t.resolution_type,
        t.assigned_to,
        t.created_at,
        t.updated_at,
        c.id AS customer_id,
        c.phone AS customer_phone,
        u.name AS customer_name,
        u.email AS customer_email,
        o.id AS order_id,
        o.order_number,
        o.status AS order_status,
        o.total_amount AS order_amount,
        o.currency AS order_currency,
        o.tracking_number AS order_tracking_number
      FROM tickets t
      JOIN customers c ON c.id = t.customer_id
      LEFT JOIN users u ON u.id = c.user_id
      LEFT JOIN orders o ON o.id = t.order_id
      WHERE ${isUUID ? 't.id = $1' : 't.ticket_number = $1'}
      LIMIT 1;
    `;

    const ticketResult = await pool.query(ticketQuery, [ticketId]);

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Ticket not found with identifier '${ticketId}'`,
      });
    }

    const ticket = ticketResult.rows[0];

    // Fetch conversation messages for this ticket
    const messagesQuery = `
      SELECT
        m.id,
        m.ticket_id,
        m.sender_type,
        m.sender_user_id,
        u.name AS sender_name,
        m.content,
        m.created_at
      FROM messages m
      LEFT JOIN users u ON u.id = m.sender_user_id
      WHERE m.ticket_id = $1
      ORDER BY m.created_at ASC;
    `;

    const messagesResult = await pool.query(messagesQuery, [ticket.id]);

    return res.status(200).json({
      success: true,
      data: {
        ...ticket,
        messages: messagesResult.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
