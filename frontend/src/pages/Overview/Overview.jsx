import { useEffect, useState, useContext } from "react";
import KpiCard from "../../components/KPICard/KPICard";
import { getPpeOverview, getRecentEvents, resolveEvent, getActiveAlerts, getViolationsToday, getHighSeverityAlerts, getZonesBreached, getSystemHealth} from "../../api/api";
import Switch from "@mui/material/Switch";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import EngineeringOutlined from "@mui/icons-material/EngineeringOutlined";
import CheckroomOutlined from "@mui/icons-material/CheckroomOutlined";
import NotificationsActiveOutlined from "@mui/icons-material/NotificationsActiveOutlined";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import GppBadOutlined from "@mui/icons-material/GppBadOutlined";
import FmdBadOutlined from "@mui/icons-material/FmdBadOutlined";
import { AuthContext } from "../../utils/AuthContext";
import "./Overview.css";

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);

  const { role } = useContext(AuthContext);
  const canResolve = role === "operator";
 
 

  useEffect(() => {
        const load = async () => {
          try {
            console.log("Fetching PPE overview…");
            // const res = await fetch("http://localhost:5000/analytics/ppe-overview");
            // console.log("Response status:", res.status);
            // const json = await res.json();
            // console.log("Data:", json);
            const [overviewdata, recentEvents, activeAlerts, violationsToday, highSeverity, zonesBreached, system] = await Promise.all([
              getPpeOverview(),
              getRecentEvents(),
              getActiveAlerts(),
              getViolationsToday(),
              getHighSeverityAlerts(),
              getZonesBreached(),
              getSystemHealth()
            ]);
            setData({
                ...overviewdata, 
                activeAlerts: activeAlerts.activeAlerts,
                violationsToday: violationsToday.violationsToday,
                highSeverity: highSeverity.highSeverity,
                zonesBreached: zonesBreached.zonesBreached
            });
            setEvents(recentEvents);
            setSystemHealth(system);
            console.log(system);
          } catch (err) {
            setError(err.message);
          }
        };
        load();
      }, []);

       const getValue = (key) => {
         if (!data) return "—";
         const val = data[key];
         if (val === undefined || val === null) return "—";
         if (key === "complianceRate") return `${val}%`;
         return val;
       };

       const handleResolve = async (id) => {
        await resolveEvent(id);
        setEvents(prev =>
          prev.map(e =>
            e.id === id
              ? { ...e, status: e.status === "resolved" ? "active" : "resolved"}
              : e
          )
        );
      };


      return (
        <div className="overview-wrapper">
          <div className="overview-container">
      
            {error && (
              <div style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1.5rem"
              }}>
                Error: {error}
              </div>
            )}
      
            {/* ── KPI Cards ── */}
            <div className="kpi-grid">
              <KpiCard title="Compliance Rate"  value={getValue("complianceRate")}  className="compliance" icon={VerifiedUserOutlined} />
              <KpiCard title="Total Violations" value={getValue("violations")}      className="violations" icon={WarningAmberOutlined} />
              <KpiCard title="Missing Helmet"   value={getValue("missingHelmet")}   className="helmet" icon={EngineeringOutlined} />
              <KpiCard title="Missing Vest"     value={getValue("missingVest")}     className="vest"  icon={CheckroomOutlined} />
              <KpiCard title="Active Alerts"    value={getValue("activeAlerts")}    className="alerts" icon={NotificationsActiveOutlined} />
              <KpiCard title="Violations Today" value={getValue("violationsToday")} className="today" icon={CalendarTodayOutlined} />
              <KpiCard title="High Severity"    value={getValue("highSeverity")}    className="severity"icon={GppBadOutlined} />
              <KpiCard title="Zones Breached"   value={getValue("zonesBreached")}   className="zones" icon={FmdBadOutlined} />
            </div>
          </div>
      
          {/* ── System Status ── */}
          <div className="system-status">
            {systemHealth && (
              <div className="system-grid">
      
                {/* Camera Health — wide card */}
                <div className="system-card system-card--wide">
                  <div className="system-card-header">
                    <div className="system-card-icon system-card-icon--green">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                      </svg>
                    </div>
                    <div>
                      <h4>Camera Health</h4>
                     
                    </div>
                    <span className="system-card-pct">{systemHealth.cameraHealth}%</span>
                  </div>
                  <div className="health-bar">
                    <div className="health-fill" style={{ width: `${systemHealth.cameraHealth}%` }} />
                  </div>
                  <div className="health-bar-labels">
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </div>
      
                <div className="system-card">
                  <div className="system-card-icon system-card-icon--blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </div>
                  <h4>Active Cameras</h4>
                  <p>{systemHealth.activeCameras}</p>
                  <span className="system-card-sub">Currently streaming</span>
                </div>
      
                <div className="system-card">
                  <div className="system-card-icon system-card-icon--red">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="1" y1="1" x2="23" y2="23"/>
                      <path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h1a2 2 0 012 2v9.34"/>
                    </svg>
                  </div>
                  <h4>Offline Cameras</h4>
                  <p className="system-card-value--red">{systemHealth.offlineCameras}</p>
                  <span className="system-card-sub">Require attention</span>
                </div>
      
                <div className="system-card">
                  <div className={`system-card-icon ${systemHealth.pipelineStatus === "healthy" ? "system-card-icon--green" : "system-card-icon--red"}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <h4>Detection Pipeline</h4>
                  <p className="pipeline-status">
                    <span className={`status-dot ${systemHealth.pipelineStatus === "healthy" ? "" : "unhealthy"}`} />
                    {systemHealth.pipelineStatus === "healthy" ? "Healthy" : "Unhealthy"}
                  </p>
                  <span className="system-card-sub">AI Inference</span>
                </div>
      
              </div>
            )}
          </div>
      
          {/* ── Recent Events ── */}
          <div className="events-section">
            <div className="events-header">
              <h2 className="events-title">Recent Events</h2>
            </div>
      
            <div className="events-table-container">
              {events && events.length > 0 ? (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Camera</th>
                      <th>Zone</th>
                      <th>Status</th>
                      <th>Severity</th>
                      <th>Time</th>
                      {canResolve && <th>Action</th>}  {/* ── Hide Action column header for viewers ── */}
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="td-id">{event.id}</td>
                        <td>
                          <span className="camera-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                            </svg>
                            {event.camera_code || "—"}
                          </span>
                        </td>
                        <td>{event.zone_name || "—"}</td>
                        <td>
                          <span className={`event-status-badge event-status-badge--${event.status === "resolved" ? "resolved" : "active"}`}>
                            {event.status || "Unknown"}
                          </span>
                        </td>
                        <td>
                          <span className={`severity-badge severity-${(event.severity || "").toLowerCase()}`}>
                            {event.severity || "—"}
                          </span>
                        </td>
                        <td>
                          {event.created_at
                            ? new Date(event.created_at).toLocaleString([], {
                                year: "numeric", month: "short", day: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })
                            : "—"}
                        </td>

                        {canResolve && (
                        <td style={{ padding: "8px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
                            <span style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              color: event.status === "resolved" ? "#16a34a" : "#dc2626",
                              width: "90px"
                            }}>
                              {event.status === "resolved" ? "Resolved" : "Open"}
                            </span>
                            <Switch
                              checked={event.status === "resolved"}
                              onChange={() => handleResolve(event.id)}
                              size="small"
                            />
                          </div>
                        </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="events-empty">
                  No recent events to display
                </div>
              )}
            </div>
          </div>
      
        </div>
      );
    }



  //   return (
  //     <div className="overview-wrapper">
  //       <div className="overview-container">
    
  //         {error && (
  //           <div style={{
  //             background: "#fee2e2",
  //             color: "#991b1b",
  //             padding: "1rem",
  //             borderRadius: "0.5rem",
  //             marginBottom: "1.5rem"
  //           }}>
  //             Error: {error}
  //           </div>
  //         )}
    
  //         {/* ── KPI Cards ── */}
  //         <div className="kpi-grid">
    
  //           <div className="kpi-card compliance">
  //             <div className="kpi-card-icon">
  //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                 <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
  //               </svg>
  //             </div>
  //             <div className="kpi-content">
  //               <p className="kpi-title">Compliance Rate</p>
  //               <p className="kpi-value compliance">{getValue("complianceRate")}</p>
  //             </div>
  //           </div>
    
  //           <div className="kpi-card violations">
  //             <div className="kpi-card-icon">
  //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                 <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
  //               </svg>
  //             </div>
  //             <div className="kpi-content">
  //               <p className="kpi-title">Total Violations</p>
  //               <p className="kpi-value violations">{getValue("violations")}</p>
  //             </div>
  //           </div>
    
  //           <div className="kpi-card helmet">
  //             <div className="kpi-card-icon">
  //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                 <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0H5m4 0h10m-10 0v4a2 2 0 002 2h4a2 2 0 002-2v-4"/>
  //               </svg>
  //             </div>
  //             <div className="kpi-content">
  //               <p className="kpi-title">Missing Helmet</p>
  //               <p className="kpi-value helmet">{getValue("missingHelmet")}</p>
  //             </div>
  //           </div>
    
  //           <div className="kpi-card vest">
  //             <div className="kpi-card-icon">
  //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                 <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
  //               </svg>
  //             </div>
  //             <div className="kpi-content">
  //               <p className="kpi-title">Missing Vest</p>
  //               <p className="kpi-value vest">{getValue("missingVest")}</p>
  //             </div>
  //           </div>
    
  //           <div className="kpi-card alerts">
  //             <div className="kpi-card-icon">
  //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                 <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
  //               </svg>
  //             </div>
  //             <div className="kpi-content">
  //               <p className="kpi-title">Active Alerts</p>
  //               <p className="kpi-value alerts">{getValue("activeAlerts")}</p>
  //             </div>
  //           </div>
    
  //           <div className="kpi-card today">
  //             <div className="kpi-card-icon">
  //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                 <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
  //                 <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
  //                 <line x1="3" y1="10" x2="21" y2="10"/>
  //               </svg>
  //             </div>
  //             <div className="kpi-content">
  //               <p className="kpi-title">Violations Today</p>
  //               <p className="kpi-value today">{getValue("violationsToday")}</p>
  //             </div>
  //           </div>
    
  //           <div className="kpi-card severity">
  //             <div className="kpi-card-icon">
  //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                 <circle cx="12" cy="12" r="10"/>
  //                 <line x1="12" y1="8" x2="12" y2="12"/>
  //                 <line x1="12" y1="16" x2="12.01" y2="16"/>
  //               </svg>
  //             </div>
  //             <div className="kpi-content">
  //               <p className="kpi-title">High Severity</p>
  //               <p className="kpi-value severity">{getValue("highSeverity")}</p>
  //             </div>
  //           </div>
    
  //           <div className="kpi-card zones">
  //             <div className="kpi-card-icon">
  //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                 <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
  //                 <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  //               </svg>
  //             </div>
  //             <div className="kpi-content">
  //               <p className="kpi-title">Zones Breached</p>
  //               <p className="kpi-value zones">{getValue("zonesBreached")}</p>
  //             </div>
  //           </div>
    
  //         </div>
  //       </div>
    
  //       {/* ── System Status ── */}
  //       <div className="system-status">
  //         {systemHealth && (
  //           <div className="system-grid">
    
  //             {/* Camera Health — wide card */}
  //             <div className="system-card system-card--wide">
  //               <h4>Camera Health</h4>
  //               <div className="health-bar">
  //                 <div
  //                   className="health-fill"
  //                   style={{ width: `${systemHealth.cameraHealth}%` }}
  //                 />
  //               </div>
  //               <p style={{ fontSize: "0.95rem", color: "#6b7280", marginTop: "4px" }}>
  //                 {systemHealth.cameraHealth}% operational
  //               </p>
  //             </div>
    
  //             <div className="system-card">
  //               <h4>Active Cameras</h4>
  //               <p>{systemHealth.activeCameras}</p>
  //             </div>
    
  //             <div className="system-card">
  //               <h4>Offline Cameras</h4>
  //               <p>{systemHealth.offlineCameras}</p>
  //             </div>
    
  //             <div className="system-card">
  //               <h4>Detection Pipeline</h4>
  //               <p className="pipeline-status">
  //                 <span
  //                   className={`status-dot ${
  //                     systemHealth.pipelineStatus === "healthy" ? "" : "unhealthy"
  //                   }`}
  //                 />
  //                 {systemHealth.pipelineStatus === "healthy" ? "Healthy" : "Unhealthy"}
  //               </p>
  //             </div>
    
  //           </div>
  //         )}
  //       </div>
    
  //       {/* ── Recent Events ── */}
  //       <div className="events-section">
  //         <div className="events-header">
  //           <h2 className="events-title">Recent Events</h2>
  //         </div>
    
  //         <div className="events-table-container">
  //           {events && events.length > 0 ? (
  //             <table className="events-table">
  //               <thead>
  //                 <tr>
  //                   <th>ID</th>
  //                   <th>Camera</th>
  //                   <th>Zone</th>
  //                   <th>Status</th>
  //                   <th>Severity</th>
  //                   <th>Time</th>
  //                   <th>Action</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {events.map((event) => (
  //                   <tr key={event.id}>
  //                     <td>{event.id}</td>
  //                     <td>{event.camera_code || "—"}</td>
  //                     <td>{event.zone_name || "—"}</td>
  //                     <td>{event.status || "Unknown"}</td>
  //                     <td>
  //                       <span className={`severity-badge severity-${(event.severity || "").toLowerCase()}`}>
  //                         {event.severity || "—"}
  //                       </span>
  //                     </td>
  //                     <td>
  //                       {event.created_at
  //                         ? new Date(event.created_at).toLocaleString([], {
  //                             year: "numeric", month: "short", day: "numeric",
  //                             hour: "2-digit", minute: "2-digit",
  //                           })
  //                         : "—"}
  //                     </td>
  //                     <td style={{ padding: "8px 12px" }}>
  //                       <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
  //                         <span style={{
  //                           fontSize: "16px",
  //                           fontWeight: 600,
  //                           color: event.status === "resolved" ? "#16a34a" : "#dc2626",
  //                           width: "90px"
  //                         }}>
  //                           {event.status === "resolved" ? "Resolved" : "Open"}
  //                         </span>
  //                         <Switch
  //                           checked={event.status === "resolved"}
  //                           onChange={() => handleResolve(event.id)}
  //                           size="small"
  //                         />
  //                       </div>
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           ) : (
  //             <div className="events-empty">
  //               No recent events to display
  //             </div>
  //           )}
  //         </div>
  //       </div>
    
  //     </div>
  //   );
  // }