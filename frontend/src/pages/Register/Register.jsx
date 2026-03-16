import React, { useContext, useState } from "react";
import "./Register.css";
import hypervise_blue from "../../images/hypervise_blue.png";
import safetyBg from "../../images/safety_bg.png";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import { AuthContext } from "../../utils/AuthContext";

export default function Register() {
  const { handleRegisterContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const isNarrow= window.innerWidth < 1000;
  const isCompact= window.innerWidth < 530;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("operator");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [openSuccessDialog, setOpenSuccessDialog]= useState(false);
  const [openErrorDialog, setOpenErrorDialog]= useState(false);
  const [errorMessage, setErrorMessage]= useState("");

  const togglePasswordVisibility = () => setPasswordVisible((v) => !v);
  const toggleConfirmVisibility  = () => setConfirmVisible((v) => !v);

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Please enter a password.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function handleRegister(event) {
    event.preventDefault();
    if (!validate()) return;

    const res = await handleRegisterContext({ email, password, role });

    if (res?.status === 201) {
      setOpenSuccessDialog(true);
    } else {
      setErrorMessage(res?.data?.error || "Registration failed. Please try again.");
      setOpenErrorDialog(true);
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
            <div className="image-bg__overlay">
              <div className="image-bg__text">
                <span className="image-bg__title">Industrial Safety</span>
                <span className="image-bg__subtitle">Monitor · Detect · Protect</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Right form panel ── */}
        <div className="login_submain" style={{ backgroundColor: "#ffffff", width: "100%" }}>
          <div
            className="login_details"
            style={{ width: isCompact ? "80%" : "428px", paddingTop: "50px", paddingBottom: "50px" }}
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

            {/* Heading */}
            <div className="head">
              <span style={{ fontSize: "36px", fontWeight: "bold", lineHeight: "44px", color: "#101623" }}>
                Create Account
              </span>
              <span style={{ fontSize: "15px", fontWeight: "600", lineHeight: "24px", color: "#1015" }}>
                Register to access Hypervise Dashboard
              </span>
            </div>

            {/* Form */}
            <form className="form" onSubmit={handleRegister}>

              {/* Email */}
              <div className="field">
                <p style={{ color: "#3b4453", fontSize: "14px", fontWeight: "600", lineHeight: "20px" }}>Email</p>
                <input
                  style={{ backgroundColor: "#f4f5f6" }}
                  type="text"
                  placeholder="Enter your email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
              </div>

              {/* Role */}
              <div className="field">
                <p style={{ color: "#3b4453", fontSize: "14px", fontWeight: "600", lineHeight: "20px" }}>Role</p>
                <select
                  className="input"
                  style={{ backgroundColor: "#f4f5f6", cursor: "pointer" }}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              {/* Password */}
              <div className="field" style={{ position: "relative" }}>
                <p style={{ color: "#3b4453", fontSize: "14px", fontWeight: "600", lineHeight: "20px" }}>Password</p>
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
                    position: "absolute", right: "10px",
                    top: formErrors.password ? "53%" : "74%",
                    transform: "translateY(-60%)",
                    cursor: "pointer", color: "#3b4453",
                  }}
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="field" style={{ position: "relative" }}>
                <p style={{ color: "#3b4453", fontSize: "14px", fontWeight: "600", lineHeight: "20px" }}>Confirm Password</p>
                <input
                  style={{ backgroundColor: "#f4f5f6" }}
                  placeholder="Confirm your password"
                  type={confirmVisible ? "text" : "password"}
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {formErrors.confirmPassword && <p style={{ color: "red" }}>{formErrors.confirmPassword}</p>}
                <span
                  className="icon"
                  style={{
                    position: "absolute", right: "10px",
                    top: formErrors.confirmPassword ? "53%" : "74%",
                    transform: "translateY(-60%)",
                    cursor: "pointer", color: "#3b4453",
                  }}
                  onClick={toggleConfirmVisibility}
                >
                  {confirmVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                </span>
              </div>

              <button className="btn" type="submit">Register</button>

              {/* Link to login */}
              <p style={{ textAlign: "center", fontSize: "14px", color: "#3b4453" }}>
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{ color: "#1a73e8", fontWeight: "600", cursor: "pointer" }}
                >
                  Log in
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* ── Success dialog ── */}
      <Dialog open={openSuccessDialog} onClose={() => { setOpenSuccessDialog(false); navigate("/login"); }} PaperProps={{ style: { background: "#ffffff" } }}>
        <DialogTitle sx={{ color: "#36B37E", fontWeight: "600" }}>Registration Successful</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#101623" }}>Your account has been created. You can now log in.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenSuccessDialog(false); navigate("/login"); }} color="primary" sx={{ fontWeight: "bold" }} variant="contained">
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Error dialog ── */}
      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} PaperProps={{ style: { background: "#ffffff" } }}>
        <DialogTitle sx={{ color: "#FF5630", fontWeight: "600" }}>Registration Failed</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#101623" }}>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)} color="primary" sx={{ fontWeight: "bold" }} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}