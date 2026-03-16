import pool from "../../db/connection.js";

export const findUserByUsername = async (username) => {

  const [rows] = await pool.query(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );
  return rows[0];

};
export const createUser = async (username, password_hash, role) => {
  const [result] = await pool.query(
    `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
    [username, password_hash, role]
  );
  return result.insertId;
};