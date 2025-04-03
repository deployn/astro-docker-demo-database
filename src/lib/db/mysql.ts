import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";
import type { Note } from "../../types";

let mysqlPool: Pool | undefined; // Defined in initializeMySQLPool

async function initializeMySQLPool(): Promise<Pool> {
  if (!mysqlPool) {
    try {
      mysqlPool = await mysql.createPool({
        host: import.meta.env.MYSQL_HOST || "mysql",
        port: parseInt(import.meta.env.MYSQL_PORT || "3306"),
        user: import.meta.env.MYSQL_USER || "demouser",
        password: import.meta.env.MYSQL_PASSWORD || "demopass",
        database: import.meta.env.MYSQL_DB || "demo",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log("MySQL connection pool created.");
    } catch (error) {
      console.error("Error creating MySQL connection pool:", error);
      throw error;
    }
  }
  return mysqlPool!;
}

export async function ensureMySqlTableExists(): Promise<void> {
  const pool = await initializeMySQLPool();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL
      )
    `);
    console.log("MySQL 'notes' table checked/created.");
  } catch (error) {
    console.error("Error ensuring MySQL table exists:", error);
    throw error;
  }
}

export async function getMySqlNotes(): Promise<Note[]> {
  const pool = await initializeMySQLPool();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, content FROM notes ORDER BY id DESC"
    );
    return rows as Note[];
  } catch (error) {
    console.error("Error fetching MySQL notes:", error);
    return [];
  }
}

export async function addMySqlNote(content: string): Promise<void> {
  if (!content) {
    console.error("Cannot add empty note to MySQL.");
    throw new Error("Note content cannot be empty.");
  }
  const pool = await initializeMySQLPool();
  try {
    await pool.query("INSERT INTO notes (content) VALUES (?)", [content]);
    console.log("Note added to MySQL.");
  } catch (error) {
    console.error("Error adding MySQL note:", error);
    throw error;
  }
}

export async function clearMySqlNotes(): Promise<void> {
  const pool = await initializeMySQLPool();
  try {
    await pool.query("TRUNCATE TABLE notes");
    console.log("MySQL notes cleared.");
  } catch (error) {
    console.error("Error clearing MySQL notes:", error);
    throw error;
  }
}
