import { useEffect, useState } from "react";
import { getAlerts } from "../../api/api";
import VideocamOutlined from "@mui/icons-material/VideocamOutlined";
import "./Alerts.css";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(() => {
        loadAlerts();
      }, 5000);
 
    return () => clearInterval(interval);
     }, []);

  const loadAlerts = async () => {
    const data = await getAlerts();
    setAlerts(data);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "ALL") return true;
    return alert.event_type.includes(filter);
  });

  return (
    <div className="alerts-container">
  
      <div className="alerts-header">
        <div className="section-label">Safety Alerts</div>
  
        <div className="filter-tabs">
          <button onClick={() => setFilter("ALL")}   className={`filter-tab ${filter === "ALL"   ? "active" : ""}`}>All</button>
          <button onClick={() => setFilter("PPE")}   className={`filter-tab ${filter === "PPE"   ? "active" : ""}`}>PPE</button>
          <button onClick={() => setFilter("FIRE")}  className={`filter-tab ${filter === "FIRE"  ? "active" : ""}`}>Fire</button>
          <button onClick={() => setFilter("SMOKE")} className={`filter-tab ${filter === "SMOKE" ? "active" : ""}`}>Smoke</button>
        </div>
      </div>
  
      <div className="alerts-table-container">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Zone</th>
              <th>Camera</th>
              <th>Details</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => (
              <tr key={alert.id}>
                <td className="td-time">
                  {new Date(alert.created_at).toLocaleString()}
                </td>
                <td>
                  <span className={`event-type-badge event-type-badge--${alert.event_type.toLowerCase().replace("_", "-")}`}>
                    {alert.event_type}
                  </span>
                </td>
                <td>{alert.zone_name}</td>
                <td>
                  <span className="camera-badge">
                    <VideocamOutlined style={{ fontSize: 14 }} />
                    {alert.camera_code}
                  </span>
                </td>
                <td className="td-details">
                  {alert.metadata?.missing
                    ? `Missing: ${alert.metadata.missing.join(", ")}`
                    : "—"}
                </td>
                <td className="severity-cell">
                  <span className={`severity-dot ${alert.severity.toLowerCase()}`} />
                  <span className={`severity-label severity-label--${alert.severity.toLowerCase()}`}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
  
            {filteredAlerts.length === 0 && (
              <tr>
                <td colSpan={6} className="td-empty">No alerts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
    </div>
  );
}