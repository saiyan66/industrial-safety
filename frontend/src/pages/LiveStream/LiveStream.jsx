import { useEffect, useState } from "react";
import { getRecentEvents } from "../../api/api";
import VideocamOutlined from "@mui/icons-material/VideocamOutlined";
import "./LiveStream.css";  

export default function LiveStream() {
  const [events, setEvents] = useState([]);


  useEffect(() => {
        async function load() {
          try {
            const data = await getRecentEvents();
            setEvents(data || []);
          } catch (err) {
            console.error("Failed to load events:", err);
          }
        }
        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
      }, []);

     //helper
     const formatEvent = (event) => {
       if (event.event_type === "PPE_OK") return "PPE OK";
       if (event.event_type === "PPE_VIOLATION") {
         if (event.metadata?.missing?.length) {
           return `Missing: ${event.metadata.missing.join(", ")}`;
         }
         return "PPE Violation";
       }
       if (event.event_type === "SMOKE_DETECTED") return "Smoke Detected";
       if (event.event_type === "FIRE_DETECTED") return "Fire Detected";
     
       return event.event_type;
     };
     
   return (
  <div className="container">

    {/* ──Camera Grid ── */}
    <div className="cameraGrid">
      {[1, 2, 3, 4, 5, 6].map((cam) => (
        <div key={cam} className="cameraCard">
          <div className="cameraCard-overlay" />
          <div className="cameraLabel">
            <VideocamOutlined fontSize="small" />
            Cam {cam}
          </div>
        </div>
      ))}
    </div>

    {/* ── Events Table ── */}
    <div className="alertsSection">

      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Camera</th>
              <th className="th">Zone</th>
              <th className="th">Event</th>
              <th className="th">Time</th>
              <th className="th">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="table-row">
                <td className="td">
                  <span className="camera-badge">
                    <VideocamOutlined style={{ fontSize: 14 }} />
                    {event.camera_code || "—"}
                  </span>
                </td>
                <td className="td">{event.zone_name}</td>
                <td className="td">{formatEvent(event)}</td>
                <td className="td td--time">
                  {new Date(event.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="td">
                  {event.is_compliant ? (
                    <span className="safeStatus">Safe</span>
                  ) : (
                    <span className="violationStatus">Violation</span>
                  )}
                </td>
              </tr>
            ))}

            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="td td--empty">
                  No recent events
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  </div>
);
}