import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

function parseAthleteDiscount(notes: string | null): { athleteId: string; athleteName: string; code: string } | null {
  if (!notes) return null;
  const lines = notes.split("\n");
  for (const line of lines) {
    const match = line.match(/^Athlete discount: (.+) \((.+)\)$/);
    if (match) {
      return { athleteId: "", athleteName: match[1], code: match[2] };
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const query = searchParams.get("q")?.trim();

  const orders = await prisma.order.findMany({
    where: {
      ...(status && status !== "ALL" ? { status } : {}),
      ...(query
        ? {
            OR: [
              { id: { contains: query } },
              { guestEmail: { contains: query } },
              { user: { email: { contains: query } } },
            ],
          }
        : {}),
    },
    include: { items: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const ordersWithAthlete = orders.map((order) => ({
    ...order,
    athleteDiscount: parseAthleteDiscount(order.notes),
  }));

  return NextResponse.json({ orders: ordersWithAthlete });
}
