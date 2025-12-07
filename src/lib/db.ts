import { neon } from "@neondatabase/serverless";

const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "";
export const sql = url ? neon(url) : null as unknown as ReturnType<typeof neon> | null;

export async function ensureSchema() {
  if (!sql) return;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT,
      password TEXT NOT NULL,
      role TEXT,
      verified BOOLEAN,
      avatar TEXT,
      phone TEXT,
      address TEXT
    );
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(username);
  `;
}
