import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sql, ensureSchema } from "@/lib/db";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

type User = { name: string; email: string; username?: string; password: string; role?: string; verified?: boolean; avatar?: string };
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

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.name || !body.email || !body.password) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const name = String(body.name).trim();
  const email = String(body.email).trim().toLowerCase();
  const password = String(body.password);
  const username = body.username ? String(body.username).trim() : undefined;
  const avatar = body.avatar ? String(body.avatar) : undefined;
  const phone = body.phone ? String(body.phone) : undefined;
  const address = body.address ? String(body.address) : undefined;

  if (sql) {
    await ensureSchema();
    const exists = (await sql`SELECT email FROM users WHERE lower(email) = ${email}`) as unknown as OnlyEmail[];
    if (exists.length > 0) return NextResponse.json({ error: "exists" }, { status: 409 });
    const hash = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users (email,name,username,password,role,verified,avatar,phone,address) VALUES (${email}, ${name}, ${username || null}, ${hash}, ${"user"}, ${true}, ${avatar || null}, ${phone || null}, ${address || null})`;
    return NextResponse.json({ name, email, username, avatar }, { status: 201 });
  }

  const users = loadUsers();
  if (users.some((u) => (u.email || "").toLowerCase() === email)) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }
  const user: User = { name, email, username, password, role: "user", verified: true, avatar };
  users.push(user);
  saveUsers(users);
  return NextResponse.json({ name: user.name, email: user.email, username: user.username, avatar: user.avatar }, { status: 201 });
}
