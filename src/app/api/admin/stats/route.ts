import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const [
    totalOrders,
    paidOrders,
    recentOrders,
    previousOrders,
    customers,
    products,
    variants,
    lowStock,
    outOfStock,
    pendingOrders,
    recent,
    topProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      where: { status: { not: "CANCELLED" } },
      select: { total: true, createdAt: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo }, status: { not: "CANCELLED" } } }),
    prisma.order.count({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, status: { not: "CANCELLED" } },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.productVariant.aggregate({ _sum: { stock: true } }),
    prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
    prisma.productVariant.count({ where: { stock: { lte: 0 } } }),
    prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PROCESSING"] } } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { items: true, user: { select: { name: true, email: true } } },
    }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const unitsSold = paidOrders.length
    ? await prisma.orderItem.aggregate({
        where: { order: { status: { not: "CANCELLED" } } },
        _sum: { quantity: true },
      })
    : { _sum: { quantity: 0 } };

  const orderChange =
    previousOrders === 0
      ? recentOrders > 0
        ? 100
        : 0
      : Math.round(((recentOrders - previousOrders) / previousOrders) * 1000) / 10;

  return NextResponse.json({
    stats: {
      revenue,
      totalOrders: paidOrders.length,
      unitsSold: unitsSold._sum.quantity ?? 0,
      totalCustomers: customers,
      totalProducts: products,
      totalStock: variants._sum.stock ?? 0,
      lowStock,
      outOfStock,
      pendingOrders,
      orderChange,
    },
    recentOrders: recent,
    topProducts,
  });
}
