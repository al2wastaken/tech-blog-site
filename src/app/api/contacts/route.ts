import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

async function requireAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization") || (req.headers.get("x-session-token") ? `Bearer ${req.headers.get("x-session-token")}` : null);
  if (!auth) return null;
  const token = auth.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token);
  if (!payload || !payload.administrator) return null;
  return payload;
}

export async function GET(req: NextRequest) {
  await connectDB();
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const list = await Contact.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(list);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  let body: any = {};
  try { body = await req.json(); } catch { body = {}; }
  const id = body.id || req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Eksik id" }, { status: 400 });

  try {
    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Silme hatası" }, { status: 500 });
  }
}
