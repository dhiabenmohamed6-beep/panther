import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.marqueeMessage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.text !== undefined) data.text = String(body.text).trim();
  if (body.enabled !== undefined) data.enabled = Boolean(body.enabled);
  if (body.position !== undefined) data.position = Number(body.position) || 0;

  const message = await prisma.marqueeMessage.update({ where: { id }, data });
  return NextResponse.json({ message });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.marqueeMessage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  await prisma.marqueeMessage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
