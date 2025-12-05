import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, email, password, administrator } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Tüm alanlar zorunlu." }, { status: 400 });
  }
  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ error: "Bu email ile kullanıcı zaten var." }, { status: 409 });
  }
  const user = await User.create({ name, email, password, administrator: !!administrator });
  return NextResponse.json({ message: "Kayıt başarılı", user: { name: user.name, email: user.email, administrator: user.administrator } }, { status: 201 });
}
