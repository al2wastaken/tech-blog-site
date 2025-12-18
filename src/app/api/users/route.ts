import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

async function requireAdmin(token: string | null) {
  if (!token) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) };
  }
  await connectDB();
  const user = await User.findById(payload.userId);
  if (!user || !user.administrator) return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  return { user };
}

export async function GET(req: Request) {
  const token = req.headers.get && req.headers.get('x-session-token') || (req.headers && (req.headers as any).authorization && String((req.headers as any).authorization).replace(/^Bearer\s+/i, "")) || null;
  const ok = await requireAdmin(token);
  if ((ok as any).error) return (ok as any).error;
  await connectDB();
  const users = await User.find().select('-password').sort({ name: 1 });
  return NextResponse.json(users);
}
