import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.sizeGuide.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Size not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.chest !== undefined) data.chest = Number(body.chest) || 0;
  if (body.length !== undefined) data.length = Number(body.length) || 0;
  if (body.shoulder !== undefined) data.shoulder = Number(body.shoulder) || 0;

  const size = await prisma.sizeGuide.update({ where: { id }, data });
  return NextResponse.json({ size });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.sizeGuide.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Size not found" }, { status: 404 });

  await prisma.sizeGuide.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
