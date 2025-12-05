import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload || !payload.administrator) {
    return NextResponse.json({ error: "Admin yetkisi yok" }, { status: 403 });
  }
  return NextResponse.json({ message: "Admin dashboard erişimi başarılı", user: { name: payload.name, email: payload.email } });
}
