import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.athlete.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Athlete not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.instagram !== undefined) data.instagram = body.instagram ? String(body.instagram) : null;
  if (body.description !== undefined) data.description = body.description ? String(body.description) : null;
  if (body.image !== undefined) data.image = body.image ? String(body.image) : null;
  if (body.featured !== undefined) data.featured = Boolean(body.featured);
  if (body.position !== undefined) data.position = Number(body.position) || 0;
  if (body.discountCode !== undefined) data.discountCode = body.discountCode ? String(body.discountCode).toUpperCase() : null;
  if (body.discountPercent !== undefined) data.discountPercent = Math.max(0, Math.min(100, Number(body.discountPercent) || 0));

  const athlete = await prisma.athlete.update({ where: { id }, data });
  return NextResponse.json({ athlete });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.athlete.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Athlete not found" }, { status: 404 });

  await prisma.athlete.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
