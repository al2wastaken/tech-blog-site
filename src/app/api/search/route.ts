import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  await connectDB();
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const category = (url.searchParams.get("category") || "").trim();
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10")));
  const skip = (page - 1) * limit;

  // build flexible filter: support searching by text and by category id/name/slug
  const filter: any = {};
  const andClauses: any[] = [];

  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    andClauses.push({ $or: [{ title: regex }, { content: regex }] });
  }

  if (category) {
    let resolvedName: string | null = null;
    try {
      if (/^[0-9a-fA-F]{24}$/.test(category)) {
        const cat = await Category.findById(category).lean();
        if (cat) resolvedName = cat.name;
      }
    } catch (e) {
      // ignore
    }
    if (!resolvedName) {
      const cat = await Category.findOne({ $or: [{ slug: category }, { name: category }] }).lean();
      if (cat) resolvedName = cat.name;
    }

    if (resolvedName) {
      andClauses.push({
        $or: [
          { category: resolvedName },
          { category: category },
          { categoryId: resolvedName },
          { categoryId: category },
        ],
      });
    } else {
      andClauses.push({ $or: [{ category: category }, { categoryId: category }] });
    }
  }

  if (andClauses.length > 0) filter.$and = andClauses;

  const total = await Blog.countDocuments(filter);
  const results = await Blog.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean();

  return NextResponse.json({ total, page, limit, results });
}
