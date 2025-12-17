import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

async function requireUser(req: NextRequest) {
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
  return user;
}

// helper: accept either an id or a url slug
async function findBlogByParam(param: string | undefined | null) {
  if (!param) return null;
  // try by id
  try {
    const byId = await Blog.findById(param);
    if (byId) return byId;
  } catch (e) {
    // ignore invalid id
  }
  // then try by url field
  const byUrl = await Blog.findOne({ url: param });
  return byUrl;
}

export async function GET(req: NextRequest, context: any) {
  await connectDB();
  const maybeParams = context?.params;
  const params = typeof maybeParams?.then === 'function' ? await maybeParams : maybeParams;
  const idParam = params?.id;
  const blog = await findBlogByParam(idParam);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PUT(req: NextRequest, context: any) {
  const maybeUser = await requireUser(req);
  if ((maybeUser as any)?.status) return maybeUser as any; // NextResponse returned
  const user = maybeUser as any;
  await connectDB();
  const maybeParams = context?.params;
  const params = typeof maybeParams?.then === 'function' ? await maybeParams : maybeParams;
  const idParam = params?.id;
  const body = await req.json();
  const updateData = { ...body, author: user.name };
  const existing = await findBlogByParam(idParam);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = await Blog.findByIdAndUpdate(existing._id, updateData, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, context: any) {
  const maybeUser = await requireUser(req);
  if ((maybeUser as any)?.status) return maybeUser as any;
  await connectDB();
  const maybeParams = context?.params;
  const params = typeof maybeParams?.then === 'function' ? await maybeParams : maybeParams;
  const idParam = params?.id;
  const existing = await findBlogByParam(idParam);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await Blog.findByIdAndDelete(existing._id);
  return NextResponse.json({ ok: true });
}
