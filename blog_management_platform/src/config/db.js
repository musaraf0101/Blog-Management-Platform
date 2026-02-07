import { pool } from "./dbConfig.js";

export const DBConnection = async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 As result");
    console.log("MySQL connected", rows[0].result);
  } catch (error) {
    console.log("Connection failed", error.message);
    process.exit(1);
  }
};
