import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { Collection } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function GET() {
  await connectDB();
  const blogs = await Blog.find().sort({ date: -1 });
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  // verify JWT from header `x-session-token` or `Authorization: Bearer ...`
  const token = req.headers.get("x-session-token") || (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "") || null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const user = await User.findById(payload.userId);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { category, title, content, date, url } = body || {};
  if (!category || !title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const blogData: any = {
    category,
    title,
    content,
    author: user.name,
    date: date ? new Date(date) : new Date(),
  };

  // generate or use provided url (slug)
  const providedUrl = url ? String(url).trim() : '';
  const slugBase = providedUrl || title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 120);

  const finalUrl = slugBase || `post-${Date.now()}`;
  let attempt = 0;
  while (true) {
    const candidate = attempt === 0 ? finalUrl : `${finalUrl}-${attempt}`;
    try {
      const created = await Blog.create({ ...blogData, url: candidate });
      return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
      if (err && err.code === 11000 && err.keyPattern && err.keyPattern.url) {
        attempt += 1;
        continue;
      }
      throw err;
    }
  }
}
