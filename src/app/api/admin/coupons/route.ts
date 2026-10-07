import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const body = await request.json();
  const code = String(body.code || "").trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) return NextResponse.json({ error: "Code already exists" }, { status: 400 });

  const type = String(body.type || "PERCENT").toUpperCase();
  if (!["PERCENT", "FIXED"].includes(type)) {
    return NextResponse.json({ error: "Invalid coupon type" }, { status: 400 });
  }

  const value = Number(body.value) || 0;
  if (value <= 0) return NextResponse.json({ error: "Value must be greater than 0" }, { status: 400 });
  if (type === "PERCENT" && value > 100) {
    return NextResponse.json({ error: "Percentage cannot exceed 100" }, { status: 400 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code,
      type,
      value,
      minOrder: Number(body.minOrder) || 0,
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : null,
      usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
      active: body.active === undefined ? true : Boolean(body.active),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  });

  return NextResponse.json({ coupon }, { status: 201 });
}
