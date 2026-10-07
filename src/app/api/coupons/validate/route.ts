import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  let body: { code?: string; subtotal?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const code = String(body.code || "").trim().toUpperCase();
  const subtotal = Number(body.subtotal) || 0;

  if (!code) return NextResponse.json({ error: "Enter a promo code" }, { status: 400 });

  // First check regular coupons
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (coupon && coupon.active) {
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "That promo code has expired" }, { status: 400 });
    }
    if (coupon.startsAt && coupon.startsAt > new Date()) {
      return NextResponse.json({ valid: false, error: "That promo code is not active yet" }, { status: 400 });
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { valid: false, error: "That promo code has reached its usage limit" },
        { status: 400 }
      );
    }
    if (subtotal < coupon.minOrder) {
      return NextResponse.json(
        {
          valid: false,
          error: `This code requires a minimum order of ${coupon.minOrder.toFixed(2)} DT`,
        },
        { status: 400 }
      );
    }

    let discount = coupon.type === "PERCENT" ? (subtotal * coupon.value) / 100 : coupon.value;
    if (coupon.maxDiscount !== null) discount = Math.min(discount, coupon.maxDiscount);
    discount = Math.min(discount, subtotal);
    discount = Math.round(discount * 100) / 100;

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      discount,
      source: "coupon",
    });
  }

  // Then check athlete discount codes
  const athlete = await prisma.athlete.findUnique({ where: { discountCode: code } });
  if (athlete && athlete.discountPercent > 0) {
    let discount = (subtotal * athlete.discountPercent) / 100;
    discount = Math.min(discount, subtotal);
    discount = Math.round(discount * 100) / 100;

    return NextResponse.json({
      valid: true,
      code: athlete.discountCode,
      type: "PERCENT",
      discount,
      source: "athlete",
      athleteId: athlete.id,
      athleteName: athlete.name,
    });
  }

  return NextResponse.json({ valid: false, error: "That promo code is not valid" }, { status: 400 });
}