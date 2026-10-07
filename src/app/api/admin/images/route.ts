import { NextRequest, NextResponse } from "next/server";
import { readdir, unlink } from "fs/promises";
import { join, basename, extname } from "path";
import { existsSync } from "fs";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

const IMAGES_DIR = join(process.cwd(), "public", "images");
const DELETABLE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"]);

export async function GET() {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  if (!existsSync(IMAGES_DIR)) return NextResponse.json({ images: [] });

  const entries = await readdir(IMAGES_DIR, { withFileTypes: true });
  const images = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && DELETABLE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
      .map(async (entry) => {
        const { size, mtimeMs } = await import("fs/promises").then((fs) =>
          fs.stat(join(IMAGES_DIR, entry.name)),
        );
        return {
          filename: entry.name,
          url: `/images/${entry.name}`,
          size,
          updatedAt: mtimeMs,
        };
      }),
  );

  images.sort((a, b) => b.updatedAt - a.updatedAt);

  return NextResponse.json({ images });
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const filename = basename(String(request.nextUrl.searchParams.get("filename") || ""));

  if (!filename || !DELETABLE_EXTENSIONS.has(extname(filename).toLowerCase())) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const target = join(IMAGES_DIR, filename);
  if (!existsSync(target)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  await unlink(target);

  return NextResponse.json({ ok: true });
}