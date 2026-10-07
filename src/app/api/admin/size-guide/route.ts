import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const sizes = await prisma.sizeGuide.findMany({ orderBy: { size: "asc" } });
  return NextResponse.json({ sizes });
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const body = await request.json();
  const size = String(body.size || "").trim().toUpperCase();
  if (!size) return NextResponse.json({ error: "Size is required" }, { status: 400 });

  const existing = await prisma.sizeGuide.findUnique({ where: { size } });
  if (existing) return NextResponse.json({ error: "Size already exists" }, { status: 400 });

  const created = await prisma.sizeGuide.create({
    data: {
      size,
      chest: Number(body.chest) || 0,
      length: Number(body.length) || 0,
      shoulder: Number(body.shoulder) || 0,
    },
  });

  return NextResponse.json({ size: created }, { status: 201 });
}
