import { loginUser, registerUser } from "./auth.service.js";

export const login = async (req, res) => {

  try {

    const { username, password } = req.body;
    console.log("Received:", username, password);
    const result = await loginUser(username, password);

    res.json(result);

  } catch (error) {
    res.status(401).json({
      error: error.message
    });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
 
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
 
    const user = await registerUser(username, password);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};