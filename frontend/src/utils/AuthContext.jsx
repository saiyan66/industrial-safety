import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  //Login
  const handleLoginContext = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        {
          username: data.email,  
          password: data.password
        }
      );
      const { token, user } = res.data;
 
      localStorage.setItem("token", token);
      localStorage.setItem("role",  user.role);
 
      setToken(token);
      setRole(user.role);
 
      return res;
    } catch (error) {
      return error.response;
    }
  };

  //Register
  const handleRegisterContext = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        username: data.email,
        password: data.password,
      });
      return res;
    } catch (error) {
      return error.response;
    }
  };
 
  //Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        handleLoginContext,
        handleRegisterContext,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};