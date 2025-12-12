import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

async function createUsersTable() {
  const db = await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Users table created successfully.");
  } catch (err) {
    console.error("❌ Error creating users table:", err.message);
  } finally {
    await db.close();
  }
}

createUsersTable();
