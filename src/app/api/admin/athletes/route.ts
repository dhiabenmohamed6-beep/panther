import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  const athletes = await prisma.athlete.findMany({
    where: query ? { name: { contains: query } } : undefined,
    orderBy: { position: "asc" },
  });

  return NextResponse.json({ athletes });
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const athlete = await prisma.athlete.create({
    data: {
      name,
      instagram: body.instagram ? String(body.instagram) : null,
      description: body.description ? String(body.description) : null,
      image: body.image ? String(body.image) : null,
      featured: Boolean(body.featured),
      position: Number(body.position) || 0,
      discountCode: body.discountCode ? String(body.discountCode).toUpperCase() : null,
      discountPercent: Math.max(0, Math.min(100, Number(body.discountPercent) || 0)),
    },
  });

  return NextResponse.json({ athlete }, { status: 201 });
}
