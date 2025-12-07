import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sql, ensureSchema } from "@/lib/db";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

type User = { name: string; email: string; username?: string; password: string; role?: string; verified?: boolean; avatar?: string };
type DbUserRow = { name: string; email: string; username?: string; password?: string; role?: string; verified?: boolean; avatar?: string; phone?: string; address?: string };

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

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.identifier || !body.password) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const identifier = String(body.identifier).trim().toLowerCase();
  const password = String(body.password);
  const digits = identifier.replace(/\D/g, "");
  if (sql) {
    await ensureSchema();
    let rows = (await sql`SELECT name,email,username,password,role,verified,avatar,phone,address FROM users WHERE lower(email) = ${identifier} OR lower(username) = ${identifier} OR lower(name) = ${identifier} LIMIT 1`) as unknown as DbUserRow[];
    if (rows.length === 0 && digits) {
      rows = (await sql`SELECT name,email,username,password,role,verified,avatar,phone,address FROM users WHERE regexp_replace(coalesce(phone,'')::text, '\\D', '', 'g') = ${digits} LIMIT 1`) as unknown as DbUserRow[];
    }
    if (rows.length === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const user = rows[0];
    const ok = await bcrypt.compare(password, String(user.password || ""));
    if (!ok) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    if (user.verified === false) return NextResponse.json({ error: "unverified" }, { status: 403 });
    const token = Buffer.from(`${user.email}:${Date.now()}`).toString("base64");
    return NextResponse.json({ token, name: user.name, email: user.email, username: user.username, avatar: user.avatar, role: user.role, phone: user.phone, address: user.address });
  }
  const users = loadUsers();
  const user = users.find((u) => {
    const byEmail = (u.email || "").toLowerCase() === identifier;
    const byUsername = (u.username || "").toLowerCase() === identifier;
    const byName = (u.name || "").trim().toLowerCase() === identifier;
    return byEmail || byUsername || byName;
  });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (user.password !== password) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  if (user.verified === false) return NextResponse.json({ error: "unverified" }, { status: 403 });
  const token = Buffer.from(`${user.email}:${Date.now()}`).toString("base64");
  return NextResponse.json({ token, name: user.name, email: user.email, username: user.username, avatar: user.avatar, role: user.role });
}
