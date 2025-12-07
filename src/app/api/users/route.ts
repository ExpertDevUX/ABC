import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sql, ensureSchema } from "@/lib/db";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

type User = { name: string; email: string; username?: string; password: string; role?: string; verified?: boolean; avatar?: string };
type DbUserRow = { name: string; email: string; username?: string; password?: string; role?: string; verified?: boolean; avatar?: string; phone?: string; address?: string };
type OnlyEmail = { email: string };

function dataDir() {
  const dir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function usersFile() {
  return path.join(dataDir(), "users.json");
}

function loadUsers(): User[] {
  const file = usersFile();
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, "utf8");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  fs.writeFileSync(usersFile(), JSON.stringify(users, null, 2), "utf8");
}

export async function GET() {
  if (sql) {
    await ensureSchema();
    const rows = (await sql`SELECT name,email,username,password,role,verified,avatar,phone,address FROM users`) as unknown as DbUserRow[];
    if (rows.length === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      await sql`INSERT INTO users (email,name,username,password,role,verified) VALUES (${"admin@abc.local"}, ${"System Admin"}, ${"admin"}, ${hash}, ${"admin"}, ${true}) ON CONFLICT (email) DO NOTHING`;
      const seeded = (await sql`SELECT name,email,username,password,role,verified,avatar,phone,address FROM users`) as unknown as DbUserRow[];
      return NextResponse.json(seeded);
    }
    return NextResponse.json(rows);
  }
  const users = loadUsers();
  if (users.length === 0) {
    const admin = {
      name: "System Admin",
      email: "admin@abc.local",
      username: "admin",
      password: "admin123",
      role: "admin",
      verified: true,
    } as User;
    saveUsers([admin]);
    return NextResponse.json([admin]);
  }
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.email || !body.password || !body.name) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  if (sql) {
    await ensureSchema();
    const email = String(body.email).toLowerCase();
    const exists = (await sql`SELECT email FROM users WHERE lower(email) = ${email}`) as unknown as OnlyEmail[];
    if (exists.length > 0) return NextResponse.json({ error: "exists" }, { status: 409 });
    const hash = await bcrypt.hash(String(body.password), 10);
    await sql`INSERT INTO users (email,name,username,password,role,verified,avatar,phone,address) VALUES (${email}, ${String(body.name)}, ${body.username ? String(body.username) : null}, ${hash}, ${body.role ? String(body.role) : null}, ${body.verified === undefined ? true : !!body.verified}, ${body.avatar ? String(body.avatar) : null}, ${body.phone ? String(body.phone) : null}, ${body.address ? String(body.address) : null})`;
    const created = (await sql`SELECT name,email,username,role,verified,avatar,phone,address FROM users WHERE lower(email) = ${email}`) as unknown as DbUserRow[];
    return NextResponse.json(created[0], { status: 201 });
  }
  const users = loadUsers();
  if (users.some((u) => u.email.toLowerCase() === String(body.email).toLowerCase())) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }
  const user: User = {
    name: String(body.name),
    email: String(body.email).toLowerCase(),
    username: body.username ? String(body.username) : undefined,
    password: String(body.password),
    role: body.role ? String(body.role) : undefined,
    verified: body.verified === undefined ? true : !!body.verified,
    avatar: body.avatar ? String(body.avatar) : undefined,
  };
  users.push(user);
  saveUsers(users);
  return NextResponse.json(user, { status: 201 });
}
