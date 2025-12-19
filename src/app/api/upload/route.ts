import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as any;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const origName = file.name || `upload-${Date.now()}`;
    const safeName = `${Date.now()}-${origName.replace(/[^a-zA-Z0-9.\-_]/g, '-')}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, safeName);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${safeName}`;
    return NextResponse.json({ url });
  } catch (e: any) {
    console.error('upload error', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
