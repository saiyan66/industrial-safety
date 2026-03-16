import React, { useContext, useState } from "react";
import "./Login.css";
import hypervise_blue from "../../images/hypervise_blue.png";
import safetyBg from "../../images/safety_bg.png";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import { AuthContext } from "../../utils/AuthContext";

export default function Login() {
  const { handleLoginContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const isNarrow = window.innerWidth < 1000;
  const isCompact = window.innerWidth < 530;


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });

  const [openInvalidCredentialsDialog, setOpenInvalidCredentialsDialog] = useState(false);
  const [openEmailNotFoundDialog, setOpenEmailNotFoundDialog] = useState(false);

 
  const toggleVisibility = () => setPasswordVisible((v) => !v);
  const handleCheckboxChange = (e) => setChecked(e.target.checked);

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Please enter your password.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function handleLogin(event) {
    event.preventDefault();
    if (!validate()) return;

    const res = await handleLoginContext({ email, password });

    console.log("LOGIN RESPONSE:", res);

    if (res?.data?.token) {
      navigate("/");
    } else if (res?.status === 401) {
      setOpenInvalidCredentialsDialog(true);
    }
  }

  return (
    <>
      <div
        className="login_main"
        style={{
          display: "grid",
          gridTemplateColumns: isNarrow ? "100%" : "60% 40%",
          position: "relative",
        }}
      >
           {/* ── Left image panel ── */}
           {!isNarrow && (
          <div
            className="login_submain image-bg"
            style={{ backgroundImage: `url(${safetyBg})` }}
          >
          </div>
        )}

        {/* Right form panel */}
        <div className="login_submain" style={{ backgroundColor: "#ffffff", width: "100%" }}>
          <div
            className="login_details"
            style={{
              width: isCompact ? "80%" : "428px",
              paddingTop: "50px",
              paddingBottom: "50px",
            }}
          >
          
            <div className="image-hype-main">
              <img
                src={hypervise_blue}
                alt="hypervise"
                style={{ width: "156.42px", height: "39.94px", marginLeft: "8.88px", marginTop: "7.77px" }}
                className="image-hype"
                loading="lazy"
              />
            </div>

          
            <div className="head">
            <span className="head-subtitle">Welcome back to Hypervise Dashboard</span>
          </div>

            {/* Form */}
            <form className="form" onSubmit={handleLogin}>
             
              <div className="field">
                <p style={{ color: "#3b4453", fontSize: "14px", fontWeight: "600", lineHeight: "20px", letterSpacing: "1%" }}>
                  Email
                </p>
                <input
                  style={{ backgroundColor: "#f4f5f6" }}
                  type="text"
                  placeholder="Enter your mail"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
              </div>

           
              <div className="field" style={{ position: "relative" }}>
                <p style={{ color: "#3b4453", fontSize: "14px", fontWeight: "600", lineHeight: "20px", letterSpacing: "1%" }}>
                  Password
                </p>
                <input
                  style={{ backgroundColor: "#f4f5f6" }}
                  placeholder="Enter your password"
                  type={passwordVisible ? "text" : "password"}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {formErrors.password && <p style={{ color: "red" }}>{formErrors.password}</p>}
                <span
                  className="icon"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: formErrors.password ? "53%" : "74%",
                    transform: "translateY(-60%)",
                    cursor: "pointer",
                    color: "#3b4453",
                    fontWeight: "bold",
                  }}
                  onClick={toggleVisibility}
                >
                  {passwordVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                </span>
              </div>

            
              <div className="foot">
                <div
                  style={{
                    display: "flex",
                    fontSize: "16px",
                    flexDirection: "row",
                    gap: "6px",
                    width: "136px",
                    height: "22px",
                    color: "#3b4453",
                    lineHeight: "22px",
                    alignItems: "center",
                    fontWeight: "400",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    style={{ width: "20px", height: "20px", boxShadow: "none" }}
                    onChange={handleCheckboxChange}
                  />
                  Remember me
                </div>
                <p style={{ fontSize: "16px", color: "#101623", fontWeight: "600", lineHeight: "22px", cursor: "pointer" }}>
                  Forgot password?
                </p>
              </div>

              <button className="btn" type="submit">
                Log in
              </button>
                <p style={{ textAlign: "center", fontSize: "14px", color: "#3b4453" }}>
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    style={{ color: "#1a73e8", fontWeight: "600", cursor: "pointer" }}
                    >
                    Register
                  </span>
                </p>
            </form>
          </div>
        </div>
      </div>

   
      <Dialog
        open={openInvalidCredentialsDialog}
        onClose={() => setOpenInvalidCredentialsDialog(false)}
        PaperProps={{ style: { background: "#ffffff" } }}
      >
        <DialogTitle sx={{ color: "#FF5630", fontWeight: "600" }}>Invalid Credentials</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#101623" }}>Invalid credentials. Please try again.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInvalidCredentialsDialog(false)} color="primary" sx={{ fontWeight: "bold" }} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>

    
      <Dialog
        open={openEmailNotFoundDialog}
        onClose={() => setOpenEmailNotFoundDialog(false)}
        PaperProps={{ style: { background: "#ffffff" } }}
      >
        <DialogTitle sx={{ color: "#FF5630", fontWeight: "600" }}>Email Not Found</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#101623" }}>
            The provided email address was not found. Please check your email or sign up for an account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailNotFoundDialog(false)} color="primary" sx={{ fontWeight: "bold" }} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}





// import { useState, useContext } from "react";
// import { AuthContext } from "../../utils/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Login() {

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     try {

//       const res = await fetch("http://localhost:5000/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           username,
//           password
//         })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error);
//       }

//       login(data.token);

//       navigate("/");

//     } catch (err) {

//       setError(err.message);

//     }

//   };

//   return (
//     <div className="login-container">

//       <form onSubmit={handleSubmit} className="login-card">

//         <h2>Factory Safety Dashboard</h2>

//         {error && <p className="login-error">{error}</p>}

//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit">
//           Login
//         </button>

//       </form>

//     </div>
//   );

// }   