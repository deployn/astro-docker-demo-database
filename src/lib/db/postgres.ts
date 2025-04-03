import pkg, { type Pool, type QueryResult } from "pg";
import type { Note } from "../../types";

const pgPool: Pool = new pkg.Pool({
  host: import.meta.env.POSTGRES_HOST || "postgres",
  port: parseInt(import.meta.env.POSTGRES_PORT || "5432"),
  user: import.meta.env.POSTGRES_USER || "demouser",
  password: import.meta.env.POSTGRES_PASSWORD || "example",
  database: import.meta.env.POSTGRES_DB || "demo",
});

export async function ensurePgTableExists(): Promise<void> {
  try {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL
      )
    `);
    console.log("PostgreSQL 'notes' table checked/created.");
  } catch (error) {
    console.error("Error ensuring PostgreSQL table exists:", error);
    throw error;
  }
}

export async function getPgNotes(): Promise<Note[]> {
  try {
    const result: QueryResult<Note> = await pgPool.query(
      "SELECT id, content FROM notes ORDER BY id DESC"
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching PostgreSQL notes:", error);
    return [];
  }
}

export async function addPgNote(content: string): Promise<void> {
  if (!content) {
    console.error("Cannot add empty note to PostgreSQL.");
    // Consider throwing an error for better handling upstream
    throw new Error("Note content cannot be empty.");
  }
  try {
    await pgPool.query("INSERT INTO notes (content) VALUES ($1)", [content]);
    console.log("Note added to PostgreSQL.");
  } catch (error) {
    console.error("Error adding PostgreSQL note:", error);
    throw error;
  }
}

export async function clearPgNotes(): Promise<void> {
  try {
    await pgPool.query("TRUNCATE TABLE notes");
    console.log("PostgreSQL notes cleared.");
  } catch (error) {
    console.error("Error clearing PostgreSQL notes:", error);
    throw error;
  }
}
