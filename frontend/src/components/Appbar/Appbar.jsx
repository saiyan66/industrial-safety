import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../utils/AuthContext";
import './Appbar.css';

export default function Appbar() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("today");

  const { logout, role } = useContext(AuthContext);
  const currentRole = role || localStorage.getItem("role");

  const handleDateChange = (e) => {
    setDateRange(e.target.value);
  };

  return (
    <div className="appbar-container">
    {/* Left Section */}
    <div className="appbar-left">
      <h1
        onClick={() => navigate("/")}
        className="appbar-title"
      >
        Industrial Safety
      </h1>
    </div>

    {/* Center Filters */}
    <div className="appbar-center">
      <select
        value={dateRange}
        onChange={handleDateChange}
        className="appbar-select"
      >
        <option value="today">Today</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
      </select>
    </div>

    {/* Right Section */}
  <div className="appbar-right">
    {currentRole !== "viewer" && (
          <button onClick={() => navigate("/live")} className="appbar-btn appbar-btn-live">
            <VideocamIcon className="btn-icon" />
            Stream
          </button>
        )}

        <button className="sidebar-signout" onClick={() => {
          logout();
          navigate("/login");
          }}>
          <LogoutIcon className="signout-icon" />
          <span>Sign Out</span>
        </button>
    </div>
  </div>
);
}