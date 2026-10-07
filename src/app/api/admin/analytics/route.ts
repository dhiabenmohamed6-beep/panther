import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30";

  const days = Math.min(365, Math.max(7, Number(range) || 30));
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: from }, status: { not: "CANCELLED" } },
    select: { total: true, createdAt: true },
  });

  const buckets = new Map<string, { revenue: number; orders: number }>();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    buckets.set(date.toISOString().slice(0, 10), { revenue: 0, orders: 0 });
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue += order.total;
      bucket.orders += 1;
    }
  }

  const series = Array.from(buckets.entries()).map(([date, value]) => ({ date, ...value }));

  return NextResponse.json({ series, range: days });
}
