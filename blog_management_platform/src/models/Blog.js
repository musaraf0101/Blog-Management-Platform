import { pool } from "../config/dbConfig.js";

export const Blog = {
  create: async ({ title, content, user_id }) => {
    const [result] = await pool.execute(
      `INSERT INTO blogs (title,content,user_id)
        VALUES (?,?,?)`,
      [title, content, user_id],
    );
    const [rows] = await pool.execute(
      "SELECT id, title, content, user_id, created_at, updated_at FROM blogs WHERE id = ?",
      [result.insertId],
    );
    return rows[0];
  },
  findById: async (id) => {
    const [rows] = await pool.execute(
      "SELECT id, title, content, user_id, created_at, updated_at FROM blogs WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },
  findAll: async () => {
    const [rows] = await pool.query("SELECT id,title,content FROM blogs");
    return rows;
  },
  update: async (id, { title, content }) => {
    const [result] = await pool.execute(
      `UPDATE blogs SET title= ?, content = ? WHERE id = ?`,
      [title, content, id],
    );
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await pool.execute("DELETE FROM blogs WHERE id= ?", [id]);
    return result.affectedRows;
  },
  count: async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) as total FROM blogs");
    return rows[0].total;
  },
  findAllPaginated: async (limit, offset) => {
    const [rows] = await pool.execute(
      `
        SELECT id,title,content FROM blogs ORDER BY id DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    );
    return rows;
  },
};
