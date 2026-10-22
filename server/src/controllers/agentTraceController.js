import { pool } from '../config/db.js';

export const getAgentTraces = async (req, res, next) => {
  try {
    const { ticketId } = req.query;

    let query = `
      SELECT 
        at.id,
        at.ticket_id,
        at.run_id,
        at.step_number,
        at.event_type,
        at.tool_name,
        at.input_json,
        at.output_json,
        at.reason_summary,
        at.created_at,
        t.ticket_number
      FROM agent_traces at
      JOIN tickets t ON t.id = at.ticket_id
    `;
    const params = [];

    if (ticketId) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ticketId);
      query += ` WHERE ${isUUID ? 'at.ticket_id = $1' : 't.ticket_number = $1'}`;
      params.push(ticketId);
    }

    query += ` ORDER BY at.run_id, at.step_number ASC;`;

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

export const getAgentTracesByTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ticketId);

    const query = `
      SELECT 
        at.id,
        at.ticket_id,
        at.run_id,
        at.step_number,
        at.event_type,
        at.tool_name,
        at.input_json,
        at.output_json,
        at.reason_summary,
        at.created_at,
        t.ticket_number,
        t.subject,
        t.status
      FROM agent_traces at
      JOIN tickets t ON t.id = at.ticket_id
      WHERE ${isUUID ? 'at.ticket_id = $1' : 't.ticket_number = $1'}
      ORDER BY at.step_number ASC;
    `;

    const result = await pool.query(query, [ticketId]);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
