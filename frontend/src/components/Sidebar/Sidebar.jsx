import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { getAlerts } from "../../api/api";
import hypervise_head_blue from '../../images/hypervise_blue.png';
import Home_Blue from '../../images/home-blue.svg';
import Home_Black from '../../images/home-black.svg';
import Analytics_Dark from '../../images/Analytics_Dark.svg';
import Analytics_Light from '../../images/Analytics_Light.svg';
import alert_blue from '../../images/alert_blue.svg';
import alert_dark from '../../images/alert_dark.svg';
import Configure_Dark from '../../images/Configure_Dark.svg';
import Configure_Light from '../../images/Configure_Light.svg';
import { AuthContext } from "../../utils/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0); 

  const { logout, role } = useContext(AuthContext);
  const currentRole = role || localStorage.getItem("role");

  useEffect(() => {
      const fetchAlerts = async () => {
        try {
          const alerts = await getAlerts();
          setAlertCount(alerts.length);
        } catch (err) {
          console.error("Failed to fetch alerts");
        }
      };
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 5000);
      return () => clearInterval(interval);
      }, []);

  const allMenuItems = [
    { name: "Overview", path: "/", blue: Home_Blue, black: Home_Black,  roles: ["admin", "operator", "viewer"] },
    { name: "Analytics", path: "/analytics", blue: Analytics_Dark, black: Analytics_Light,  roles: ["admin", "viewer"] },
    { name: "Alerts", path: "/alerts", blue: alert_blue, black: alert_dark,  roles: ["admin", "operator"] },
    // { name: "Reports", path: "/reports", blue: Reports_Blue, black: Reports_Black },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(currentRole));


  return (
    <aside className="sidebar">
     
      <div className="sidebar-logo">
        <img 
          src={hypervise_head_blue} 
          alt="hypervise" 
          style={{ height: '36px', width: '141px', cursor: 'pointer', marginTop: '17px', marginLeft: '32px' }} 
        />
      </div>

      {/* Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`list-element ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <img src={item.blue} alt={item.name} className="icon_light_blue" />
            <img src={item.black} alt={item.name} className="icon_light_black" />
            <p className="list-element-text">
             {item.name}

             {item.name === "Alerts" && alertCount > 0 && (
               <span className="alert-badge">{alertCount}</span>
               )}
            </p>
          </div>
        ))}

        {/* Admin Configure */}
        {/* {UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles === "admin" && (
          <div
            className={`list-element ${location.pathname === "/configure" ? "active" : ""}`}
            onClick={() => navigate("/configure")}
          >
            <img src={Configure_Dark} alt="configure" className="icon_light_blue" />
            <img src={Configure_Light} alt="configure" className="icon_light_black" />
            <p className="list-element-text">Configure</p>
          </div>
        )} */}
      </nav>

      {/* Sign Out */}
      <div className="sidebar-footer">
        <div className="list-element-1" onClick={() => {
          logout();
          navigate("/login");
          }}>
          <LogoutIcon style={{ color: '#FF5630' }} />
          <p>Sign Out</p>
        </div>
      </div>
    </aside>
  );
}