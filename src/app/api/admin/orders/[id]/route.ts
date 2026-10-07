import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.status !== undefined) {
    const status = String(body.status).toUpperCase();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status;
  }
  if (body.notes !== undefined) data.notes = body.notes ? String(body.notes) : null;

  const wasCancelled = order.status === "CANCELLED";
  const willBeCancelled = data.status === "CANCELLED";

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.order.update({ where: { id }, data });

    if (!wasCancelled && willBeCancelled) {
      for (const item of order.items) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
        if (variant) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: Math.max(0, variant.stock + item.quantity) },
          });
        }
      }
    } else if (wasCancelled && !willBeCancelled) {
      for (const item of order.items) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
        if (variant) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: Math.max(0, variant.stock - item.quantity) },
          });
        }
      }
    }

    return result;
  });

  return NextResponse.json({ order: updated });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (order.status !== "CANCELLED") {
    for (const item of order.items) {
      const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
      if (variant) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: Math.max(0, variant.stock + item.quantity) },
        });
      }
    }
  }

  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
