import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

const COOLDOWN_SECONDS = parseInt(process.env.CONTACT_COOLDOWN || "60");

export async function POST(req: NextRequest) {
  await connectDB();
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  }

  // determine client IP (best-effort)
  const xff = req.headers.get("x-forwarded-for") || "";
  const ip = (xff.split(",")[0] || req.headers.get("x-real-ip") || req.headers.get("remote_addr") || "unknown").trim();

  try {
    const since = new Date(Date.now() - COOLDOWN_SECONDS * 1000);
    const recent = await Contact.findOne({ ip, createdAt: { $gte: since } }).lean();
    if (recent) {
      return NextResponse.json({ error: `Lütfen ${COOLDOWN_SECONDS} saniye bekleyin.` }, { status: 429 });
    }

    await Contact.create({ name, email, message, ip });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("/api/contact error:", e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
