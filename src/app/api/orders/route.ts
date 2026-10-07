import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type CheckoutBody = {
  items?: { variantId?: string; quantity?: number }[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  paymentMethod?: string;
  couponCode?: string;
  notes?: string;
};

export async function POST(request: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const address = String(body.address || "").trim();
  const city = String(body.city || "").trim();
  const postalCode = String(body.postalCode || "").trim();
  const country = String(body.country || "").trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!address || !city || !postalCode || !country) {
    return NextResponse.json({ error: "A complete shipping address is required" }, { status: 400 });
  }

  const requested = (body.items || [])
    .map((item) => ({ variantId: String(item.variantId || ""), quantity: Math.floor(Number(item.quantity) || 0) }))
    .filter((item) => item.variantId && item.quantity > 0);

  if (!requested.length) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: requested.map((i) => i.variantId) } },
    include: {
      product: {
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
      },
    },
  });

  if (variants.length !== requested.length) {
    const foundIds = new Set(variants.map((v) => v.id));
    return NextResponse.json(
      {
        error: "One or more items are no longer available",
        code: "UNAVAILABLE_ITEMS",
        unavailableVariantIds: requested
          .map((item) => item.variantId)
          .filter((variantId) => !foundIds.has(variantId)),
      },
      { status: 400 },
    );
  }

  const lines = requested.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId)!;
    return { item, variant };
  });

  for (const { item, variant } of lines) {
    if (variant.product.status !== "PUBLISHED") {
      return NextResponse.json({ error: `${variant.product.name} is not available` }, { status: 400 });
    }
    if (variant.stock < item.quantity) {
      return NextResponse.json(
        { error: `Only ${variant.stock} left of ${variant.product.name} (${variant.size})` },
        { status: 400 }
      );
    }
  }

  const pricedLines = lines.map(({ item, variant }) => {
    const base = variant.price ?? variant.product.price;
    const discounted =
      variant.product.discountActive && variant.product.discountPercent > 0
        ? base * (1 - variant.product.discountPercent / 100)
        : base;
    const unitPrice = Math.round(discounted * 100) / 100;
    return {
      quantity: item.quantity,
      unitPrice,
      lineTotal: Math.round(unitPrice * item.quantity * 100) / 100,
      variant,
    };
  });

  const subtotal =
    Math.round(pricedLines.reduce((sum, line) => sum + line.lineTotal, 0) * 100) / 100;

  let discount = 0;
  let coupon: { id: string; code: string } | null = null;
  let athleteDiscount: { id: string; code: string; name: string } | null = null;
  const couponCode = String(body.couponCode || "").trim().toUpperCase();

  if (couponCode) {
    // First check regular coupons
    const found = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (found && found.active) {
      if (found.expiresAt && found.expiresAt < new Date()) {
        return NextResponse.json({ error: "That promo code has expired" }, { status: 400 });
      }
      if (found.startsAt && found.startsAt > new Date()) {
        return NextResponse.json({ error: "That promo code is not active yet" }, { status: 400 });
      }
      if (found.usageLimit !== null && found.usedCount >= found.usageLimit) {
        return NextResponse.json({ error: "That promo code has reached its usage limit" }, { status: 400 });
      }
      if (subtotal < found.minOrder) {
        return NextResponse.json(
          { error: `This code requires a minimum order of ${found.minOrder.toFixed(2)} DT` },
          { status: 400 }
        );
      }

      discount =
        found.type === "PERCENT" ? (subtotal * found.value) / 100 : found.value;
      if (found.maxDiscount !== null) discount = Math.min(discount, found.maxDiscount);
      discount = Math.min(discount, subtotal);
      discount = Math.round(discount * 100) / 100;
      coupon = { id: found.id, code: found.code };
    } else {
      // Check athlete discount codes
      const athlete = await prisma.athlete.findUnique({ where: { discountCode: couponCode } });
      if (athlete && athlete.discountPercent > 0) {
        discount = (subtotal * athlete.discountPercent) / 100;
        discount = Math.min(discount, subtotal);
        discount = Math.round(discount * 100) / 100;
        athleteDiscount = { id: athlete.id, code: athlete.discountCode!, name: athlete.name };
      } else {
        return NextResponse.json({ error: "That promo code is not valid" }, { status: 400 });
      }
    }
  }

  const settings = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
  if (settings && (settings.maintenanceMode || !settings.storeStatus)) {
    return NextResponse.json({ error: "The store is currently closed" }, { status: 503 });
  }

  const baseShipping = settings?.shippingPrice ?? 5;
  const freeOver = settings?.freeShippingOver ?? 0;
  const shipping = freeOver > 0 && subtotal - discount >= freeOver ? 0 : baseShipping;
  const total = Math.round((subtotal - discount + shipping) * 100) / 100;
  const currency = settings?.currency || "TND";

  const session = await auth();
  const shippingName = [body.firstName, body.lastName].filter(Boolean).join(" ").trim();
  const shippingAddress = [address, city, postalCode, country].filter(Boolean).join(", ");

  // Build notes with athlete discount info if applicable
  const notesParts: string[] = [];
  if (body.notes) notesParts.push(String(body.notes));
  if (athleteDiscount) {
    notesParts.push(`Athlete discount: ${athleteDiscount.name} (${athleteDiscount.code})`);
  }
  const finalNotes = notesParts.length > 0 ? notesParts.join("\n") : null;

  const order = await prisma.$transaction(async (tx) => {
    for (const line of pricedLines) {
      const updated = await tx.productVariant.updateMany({
        where: { id: line.variant.id, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      });
      if (updated.count === 0) {
        throw new Error(`OUT_OF_STOCK:${line.variant.product.name}`);
      }
    }

    const created = await tx.order.create({
      data: {
        userId: session?.user?.id ?? null,
        guestEmail: session?.user?.id ? null : email,
        status: "PENDING",
        paymentMethod: body.paymentMethod === "card" ? "CARD" : "COD",
        subtotal,
        discount,
        shipping,
        total,
        currency,
        shippingName: shippingName || null,
        shippingPhone: body.phone ? String(body.phone) : null,
        shippingAddress,
        billingAddress: null,
        notes: finalNotes,
        items: {
          create: pricedLines.map((line) => ({
            variantId: line.variant.id,
            productId: line.variant.productId,
            quantity: line.quantity,
            price: line.unitPrice,
            productName: line.variant.product.name,
            productSlug: line.variant.product.slug,
            productImage: line.variant.product.images[0]?.url ?? null,
            size: line.variant.size,
          })),
        },
      },
      include: { items: true },
    });

    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    return created;
  });

  return NextResponse.json(
    {
      order: {
        id: order.id,
        status: order.status,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        total: order.total,
        currency: order.currency,
        athleteDiscount: athleteDiscount
          ? { athleteId: athleteDiscount.id, athleteName: athleteDiscount.name, code: athleteDiscount.code }
          : null,
      },
    },
    { status: 201 }
  );
}