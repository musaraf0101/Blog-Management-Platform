import { pool } from "./../config/dbConfig.js";

export const User = {
  create: async ({ name, email, password, role = "user" }) => {
    const [result] = await pool.execute(
      `INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)`,
      [name, email, password, role],
    );
    return { id: result.insertId };
  },

  findById: async (id) => {
    const [rows] = await pool.execute(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },

  findAll: async () => {
    const [rows] = await pool.query("SELECT id, name, email, role FROM users");
    return rows;
  },

  existsByEmail: async (email) => {
    const [rows] = await pool.execute(
      "SELECT 1 FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    return rows.length > 0;
  },

  findByEmail: async (email) => {
    const [rows] = await pool.execute(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email],
    );
    return rows[0] || null;
  },

  update: async (id, { name, email, password, role }) => {
    const [result] = await pool.execute(
      `UPDATE users 
       SET name = ?, email = ?, password = ?, role = ?
       WHERE id = ?`,
      [name, email, password, role, id],
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
  },

  count: async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) as total FROM users");
    return rows[0].total;
  },

  findAllPaginated: async (limit, offset) => {
    const [rows] = await pool.execute(
      `SELECT id, name, email, role FROM users ORDER BY id DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
      [limit, offset],
    );
    return rows;
  },
};
