import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function GET() {
  await connectDB();
  const cats = await Category.find().sort({ name: 1 });
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  await connectDB();
  // require admin user
  const token = (req.headers.get && req.headers.get("x-session-token")) || (req.headers && (req.headers as any).authorization && String((req.headers as any).authorization).replace(/^Bearer\s+/i, "")) || null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const user = await User.findById(payload.userId);
  if (!user || !user.administrator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const name = body?.name ? String(body.name).trim() : '';
  const slug = body?.slug ? String(body.slug).trim() : '';
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const baseSlug = slug || name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 120);
  try {
    const created = await Category.create({ name, slug: baseSlug });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err && err.code === 11000) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
