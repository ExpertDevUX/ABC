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

export async function GET(_: NextRequest, context: { params: Promise<{ email: string }> }) {
  const { email } = await context.params;
  const emailLc = decodeURIComponent(email).toLowerCase();
  if (sql) {
    await ensureSchema();
    const rows = (await sql`SELECT name,email,username,role,verified,avatar,phone,address FROM users WHERE lower(email) = ${emailLc}`) as unknown as DbUserRow[];
    if (rows.length === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  }
  const users = loadUsers();
  const user = users.find((u) => (u.email || "").toLowerCase() === emailLc);
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ email: string }> }) {
  const { email } = await context.params;
  const emailLc = decodeURIComponent(email).toLowerCase();
  const payload = await req.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  if (sql) {
    await ensureSchema();
    const rows = (await sql`SELECT name,email,username,password,role,verified,avatar,phone,address FROM users WHERE lower(email) = ${emailLc}`) as unknown as DbUserRow[];
    if (rows.length === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const current = rows[0];
    const pwd = payload.password !== undefined ? await bcrypt.hash(String(payload.password), 10) : current.password;
    const name = payload.name !== undefined ? String(payload.name) : current.name;
    const username = payload.username !== undefined ? String(payload.username) : current.username;
    const role = payload.role !== undefined ? String(payload.role) : current.role;
    const verified = payload.verified !== undefined ? !!payload.verified : current.verified;
    const avatar = payload.avatar !== undefined ? String(payload.avatar) : current.avatar;
    const phone = payload.phone !== undefined ? String(payload.phone) : current.phone;
    const address = payload.address !== undefined ? String(payload.address) : current.address;
    await sql`UPDATE users SET name=${name}, username=${username}, password=${pwd}, role=${role}, verified=${verified}, avatar=${avatar}, phone=${phone}, address=${address} WHERE lower(email) = ${emailLc}`;
    const updated = (await sql`SELECT name,email,username,role,verified,avatar,phone,address FROM users WHERE lower(email) = ${emailLc}`) as unknown as DbUserRow[];
    return NextResponse.json(updated[0]);
  }
  const users = loadUsers();
  const idx = users.findIndex((u) => (u.email || "").toLowerCase() === emailLc);
  if (idx < 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const current = users[idx];
  const next: User = {
    name: payload.name !== undefined ? String(payload.name) : current.name,
    email: current.email,
    username: payload.username !== undefined ? String(payload.username) : current.username,
    password: payload.password !== undefined ? String(payload.password) : current.password,
    role: payload.role !== undefined ? String(payload.role) : current.role,
    verified: payload.verified !== undefined ? !!payload.verified : current.verified,
    avatar: payload.avatar !== undefined ? String(payload.avatar) : current.avatar,
  };
  users[idx] = next;
  saveUsers(users);
  return NextResponse.json(next);
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ email: string }> }) {
  const { email } = await context.params;
  const emailLc = decodeURIComponent(email).toLowerCase();
  if (sql) {
    await ensureSchema();
    const rows = (await sql`SELECT email FROM users WHERE lower(email) = ${emailLc}`) as unknown as OnlyEmail[];
    if (rows.length === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
    await sql`DELETE FROM users WHERE lower(email) = ${emailLc}`;
    return NextResponse.json({ ok: true });
  }
  const users = loadUsers();
  const next = users.filter((u) => (u.email || "").toLowerCase() !== emailLc);
  if (next.length === users.length) return NextResponse.json({ error: "not_found" }, { status: 404 });
  saveUsers(next);
  return NextResponse.json({ ok: true });
}
