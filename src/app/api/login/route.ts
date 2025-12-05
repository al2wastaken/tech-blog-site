import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 401 });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return NextResponse.json({ error: "Şifre yanlış" }, { status: 401 });
  }
  const token = jwt.sign({ userId: user._id, email: user.email, name: user.name, administrator: user.administrator }, JWT_SECRET, { expiresIn: "7d" });
  return NextResponse.json({ token, user: { name: user.name, email: user.email, administrator: user.administrator } });
}
