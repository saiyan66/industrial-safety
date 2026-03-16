import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview/Overview";
import Layout from "./components/Layout/Layout";
import Stats from "./pages/Analytics/Stats";
import Alerts from "./pages/Alerts/Alerts";
import LiveStream from "./pages/LiveStream/LiveStream"
import Login from "./pages/Login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Register from "./pages/Register/Register";
import './index.css';



function App() {
  return (
    <BrowserRouter>

      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        
        <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
            }>

          <Route path="/" element={<Overview />} />

      
          <Route path="/analytics" element={
            <ProtectedRoute allowedRoles={["admin", "viewer"]}>
              <Stats />
            </ProtectedRoute>
          }/>
 
       
          <Route path="/live" element={
            <ProtectedRoute allowedRoles={["admin", "operator"]}>
              <LiveStream />
            </ProtectedRoute>
          }/>
 
       \
          <Route path="/alerts" element={
            <ProtectedRoute allowedRoles={["admin", "operator"]}>
              <Alerts />
            </ProtectedRoute>
          }/>
 
        </Route>
 
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;