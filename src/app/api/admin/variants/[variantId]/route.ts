import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

type Params = { params: Promise<{ variantId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { variantId } = await params;
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) return NextResponse.json({ error: "Variant not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.size !== undefined) data.size = String(body.size).toUpperCase();
  if (body.sku !== undefined && String(body.sku).trim()) data.sku = String(body.sku).trim();
  if (body.stock !== undefined) data.stock = Math.max(0, Number(body.stock) || 0);
  if (body.price !== undefined) data.price = body.price ? Number(body.price) : null;

  const updated = await prisma.productVariant.update({ where: { id: variantId }, data });
  return NextResponse.json({ variant: updated });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { variantId } = await params;
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) return NextResponse.json({ error: "Variant not found" }, { status: 404 });

  await prisma.productVariant.delete({ where: { id: variantId } });
  return NextResponse.json({ success: true });
}
