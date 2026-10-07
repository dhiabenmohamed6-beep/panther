import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.active !== undefined) data.active = Boolean(body.active);
  if (body.value !== undefined) data.value = Number(body.value) || existing.value;
  if (body.minOrder !== undefined) data.minOrder = Number(body.minOrder) || 0;
  if (body.maxDiscount !== undefined) data.maxDiscount = body.maxDiscount ? Number(body.maxDiscount) : null;
  if (body.usageLimit !== undefined) data.usageLimit = body.usageLimit ? Number(body.usageLimit) : null;
  if (body.expiresAt !== undefined) {
    data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
  }

  const coupon = await prisma.coupon.update({ where: { id }, data });
  return NextResponse.json({ coupon });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
