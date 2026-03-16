import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUserByUsername, createUser } from "./auth.repository.js";

export const loginUser = async (username, password) => {

  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password_hash
  );
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  console.log("User found:", user);

  const token = jwt.sign(
    {id: user.id, role: user.role},
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { token, user: {
    id: user.id,
    username: user.username,
    role: user.role
  }};

};

export const registerUser = async (username, password, role = "viewer") => {
 
  const existing = await findUserByUsername(username);
  if (existing) throw new Error("Username already exists");
 
  const password_hash = await bcrypt.hash(password, 10);
  // Insert into DB
  const insertId = await createUser(username, password_hash, role);
 
  return { id: insertId, username, role };
};