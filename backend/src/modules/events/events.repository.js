import pool from "../../db/connection.js";
export const insertEvent = async (event) => {
    const { 
      event_type,
      camera_id,
      zone_id,
      is_compliant,
      severity,
      metadata
    } = event;
  
    const [result] = await pool.query(
      `INSERT INTO events  
      (event_type, camera_id, zone_id, is_compliant, severity, metadata)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
      event_type,
      camera_id,
      zone_id,
      is_compliant,
      severity,
      JSON.stringify(metadata || {})
     ]
   );

     await pool.query(
       `UPDATE cameras
        SET last_frame = NOW()
        WHERE id = ?`,
       [camera_id]
     );
    return { id: result.insertId };
  };

  export const fetchRecentEvents = async () => {
    const [rows] = await pool.query(
      `SELECT
      e.id,
      e.event_type,
      e.created_at,
      e.metadata,
      e.status,
      e.severity,
      e.is_compliant,
      c.camera_code,
      c.location,
      z.zone_name
      FROM events e
      LEFT JOIN cameras c ON e.camera_id = c.id
      LEFT JOIN zones z ON e.zone_id = z.id
      ORDER BY e.created_at DESC
      LIMIT 20`
    );
    return rows;
  };
  
  export const resolveEventById = async (id) => {
    await pool.query(
      `UPDATE events SET status = CASE
      WHEN status = 'active' THEN 'resolved'
      ELSE 'active'
    END
    WHERE id = ?
    `,
    [id]);
    
    const [rows] = await pool.query(
      `SELECT status FROM events WHERE id=?`,
      [id]
    );
  
    return rows[0].status;
  };

  export const fetchAlerts = async () => {

    const [rows] = await pool.query(`
      SELECT
        e.id,
        e.event_type,
        e.severity,
        e.metadata,
        e.created_at,
        c.camera_code,
        z.zone_name
      FROM events e
      LEFT JOIN cameras c ON e.camera_id = c.id
      LEFT JOIN zones z ON e.zone_id = z.id
      WHERE e.is_compliant = FALSE
        AND e.status = 'active'
      ORDER BY e.created_at DESC
    `);
  
    return rows;
  };