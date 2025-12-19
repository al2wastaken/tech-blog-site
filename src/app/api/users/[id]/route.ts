import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

async function requireAdmin(req: NextRequest) {
  const token = req.headers.get('x-session-token') || (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '') || null;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  await connectDB();
  const user = await User.findById(payload.userId);
  if (!user || !user.administrator) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return user;
}

export async function GET(req: NextRequest, context: any) {
  const maybeUser = await requireAdmin(req);
  if ((maybeUser as any)?.status) return maybeUser as any;
  await connectDB();
  const maybeParams = context?.params;
  const params = typeof maybeParams?.then === 'function' ? await maybeParams : maybeParams;
  const id = params?.id;
  const u = await User.findById(id).select('-password');
  if (!u) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(u);
}

export async function PUT(req: NextRequest, context: any) {
  const maybeUser = await requireAdmin(req);
  if ((maybeUser as any)?.status) return maybeUser as any;
  await connectDB();
  const maybeParams = context?.params;
  const params = typeof maybeParams?.then === 'function' ? await maybeParams : maybeParams;
  const id = params?.id;
  const body = await req.json();
  const existing = await User.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (body.name) existing.name = String(body.name).trim();
  if (body.email) existing.email = String(body.email).trim();
  if (typeof body.administrator === 'boolean') existing.administrator = body.administrator;
  if (body.password) existing.password = String(body.password);
  await existing.save();
  const out = existing.toObject();
  delete out.password;
  return NextResponse.json(out);
}

export async function DELETE(req: NextRequest, context: any) {
  const maybeUser = await requireAdmin(req);
  if ((maybeUser as any)?.status) return maybeUser as any;
  await connectDB();
  const maybeParams = context?.params;
  const params = typeof maybeParams?.then === 'function' ? await maybeParams : maybeParams;
  const id = params?.id;
  const existing = await User.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await User.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
