import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  const customers = await prisma.user.findMany({
    where: query
      ? { OR: [{ email: { contains: query } }, { name: { contains: query } }] }
      : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
      orders: {
        where: { status: { not: "CANCELLED" } },
        select: { total: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const withTotals = customers.map(({ orders, ...rest }) => ({
    ...rest,
    orderCount: rest._count.orders,
    lifetimeValue: orders.reduce((sum, order) => sum + order.total, 0),
  }));

  return NextResponse.json({ customers: withTotals });
}
