import { pool } from '../config/db.js';

export const getTickets = async (req, res, next) => {
  try {
    const { customerId } = req.query;

    let query = `
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
    `;
    const params = [];

    if (customerId) {
      query += ` WHERE t.customer_id = $1`;
      params.push(customerId);
    }

    query += ` ORDER BY t.created_at DESC;`;

    const result = await pool.query(query, params);

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

export const createTicket = async (req, res, next) => {
  try {
    const { subject, description, priority, orderId, customerId } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Subject and description are required.',
      });
    }

    // Default customer if none specified
    let targetCustomerId = customerId;
    if (!targetCustomerId) {
      const defaultCust = await pool.query(`SELECT id FROM customers ORDER BY created_at ASC LIMIT 1`);
      targetCustomerId = defaultCust.rows[0]?.id;
    }

    // Generate ticket number e.g. TKT-1050
    const countRes = await pool.query(`SELECT COUNT(*) FROM tickets`);
    const nextNum = 1045 + parseInt(countRes.rows[0].count, 10);
    const ticketNumber = `TKT-${nextNum}`;

    // Resolve order_id if order_number was passed
    let orderUUID = null;
    if (orderId) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
      const oRes = await pool.query(
        `SELECT id FROM orders WHERE ${isUUID ? 'id = $1' : 'order_number = $1'} LIMIT 1`,
        [orderId]
      );
      if (oRes.rows.length > 0) {
        orderUUID = oRes.rows[0].id;
      }
    }

    const insertTicketQuery = `
      INSERT INTO tickets (ticket_number, customer_id, order_id, subject, description, status, priority)
      VALUES ($1, $2, $3, $4, $5, 'open', $6)
      RETURNING *;
    `;

    const ticketRes = await pool.query(insertTicketQuery, [
      ticketNumber,
      targetCustomerId,
      orderUUID,
      subject,
      description,
      (priority || 'normal').toLowerCase(),
    ]);

    const createdTicket = ticketRes.rows[0];

    // Add initial customer message
    await pool.query(
      `INSERT INTO messages (ticket_id, sender_type, content) VALUES ($1, 'customer', $2)`,
      [createdTicket.id, description]
    );

    // Add automated AI welcome response
    await pool.query(
      `INSERT INTO messages (ticket_id, sender_type, content) VALUES ($1, 'agent', $2)`,
      [
        createdTicket.id,
        `Hello! Thank you for reaching out to ResolveIQ. We have received your inquiry regarding "${subject}". Our team is reviewing the details and will update you shortly.`
      ]
    );

    return res.status(201).json({
      success: true,
      data: createdTicket,
    });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { content, senderType = 'customer' } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.',
      });
    }

    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ticketId);

    const ticketLookup = await pool.query(
      `SELECT id FROM tickets WHERE ${isUUID ? 'id = $1' : 'ticket_number = $1'} LIMIT 1`,
      [ticketId]
    );

    if (ticketLookup.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Ticket not found`,
      });
    }

    const realTicketId = ticketLookup.rows[0].id;

    const insertQuery = `
      INSERT INTO messages (ticket_id, sender_type, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const messageRes = await pool.query(insertQuery, [realTicketId, senderType, content]);

    // Update ticket updated_at
    await pool.query(`UPDATE tickets SET updated_at = NOW() WHERE id = $1`, [realTicketId]);

    return res.status(201).json({
      success: true,
      data: messageRes.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
