import pool from "../../db/connection.js";
export const getPpeAggregates = async () => {
  const [rows] = await pool.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN is_compliant = FALSE THEN 1 ELSE 0 END) as violations,
      SUM(CASE WHEN is_compliant = TRUE THEN 1 ELSE 0 END) as compliant,
      SUM(CASE 
          WHEN is_compliant = FALSE 
          AND JSON_CONTAINS(metadata, '"helmet"', '$.missing')
          THEN 1 ELSE 0 END) as missingHelmet,
      SUM(CASE 
          WHEN is_compliant = FALSE 
          AND JSON_CONTAINS(metadata, '"vest"', '$.missing')
          THEN 1 ELSE 0 END) as missingVest
    FROM events
    WHERE event_type IN ('PPE_OK','PPE_VIOLATION')
  `);

  return rows[0];
};

export const getViolationsByZone = async () => {
  const [rows] = await pool.query(`
    SELECT 
      zone_id,
      COUNT(*) AS violations
    FROM events
    WHERE is_compliant = FALSE
    GROUP BY zone_id
    ORDER BY violations DESC
  `)

  return rows
}

export const getComplianceTrend = async () => {
  const [rows] = await pool.query(`
    SELECT 
      DATE(created_at) AS date,
      SUM(CASE WHEN is_compliant = TRUE THEN 1 ELSE 0 END) AS compliant,
      SUM(CASE WHEN is_compliant = FALSE THEN 1 ELSE 0 END) AS violations,
      ROUND(
      SUM(is_compliant = TRUE) / COUNT(*) * 100,
      2
) AS rate
    FROM events
    GROUP BY DATE(created_at)
    ORDER BY date
  `)

  return rows
}

export const getPpeViolations = async () => {

  const [rows] = await pool.query(`
    SELECT 
      JSON_UNQUOTE(JSON_EXTRACT(metadata,'$.missing[0]')) AS type,
      COUNT(*) AS count
    FROM events
    WHERE is_compliant = FALSE
    GROUP BY type
  `)

  return rows
}

export const getViolationsByCamera = async () => {

  const [rows] = await pool.query(`
    SELECT 
      camera_id,
      COUNT(*) AS violations
    FROM events
    WHERE is_compliant = FALSE
    GROUP BY camera_id
    ORDER BY violations DESC
  `)

  return rows
}

export const getActiveAlertsCount = async () => {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS activeAlerts
    FROM events
    WHERE status = 'active'
  `);

  return rows[0].activeAlerts;
};

export const getViolationsToday = async () => {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS violationsToday
    FROM events
    WHERE is_compliant = FALSE
    AND DATE(created_at) = CURRENT_DATE
  `);

  return rows[0].violationsToday;
};

export const getHighSeverityAlerts = async () => {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS highSeverity
    FROM events
    WHERE severity = 'high'
    AND status = 'active'
  `);

  return rows[0]?.highSeverity ?? 0;
};

export const getZonesBreached = async () => {
  const [rows] = await pool.query(`
    SELECT COUNT(DISTINCT zone_id) AS zonesBreached
    FROM events
    WHERE is_compliant = FALSE
    AND status = 'active'
  `);

  return rows[0]?.zonesBreached ?? 0;
};

export const getCameraHealthStats = async () => {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS totalCameras,

      SUM(
        CASE
          WHEN last_frame > NOW() - INTERVAL 2 HOUR
          THEN 1 ELSE 0
        END
      ) AS activeCameras,

      SUM(
        CASE
          WHEN last_frame <= NOW() - INTERVAL 2 HOUR
          OR last_frame IS NULL
          THEN 1 ELSE 0
        END
      ) AS offlineCameras

    FROM cameras
  `);

  return rows[0];

};

export const getLastEventTime = async () => {
  const [rows] = await pool.query(`
    SELECT created_at
    FROM events
    ORDER BY created_at DESC
    LIMIT 1
  `);

  return rows[0]?.created_at || null;
};