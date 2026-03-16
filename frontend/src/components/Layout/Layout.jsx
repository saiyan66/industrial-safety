import { Outlet } from "react-router-dom";
import Appbar from "../Appbar/Appbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Appbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}