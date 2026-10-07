import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { variants: true } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const body = await request.json();
  const size = String(body.size || "").trim().toUpperCase();
  if (!size) return NextResponse.json({ error: "Size is required" }, { status: 400 });

  if (product.variants.some((v) => v.size === size)) {
    return NextResponse.json({ error: "Size already exists" }, { status: 400 });
  }

  const variant = await prisma.productVariant.create({
    data: {
      productId: id,
      size,
      sku: (body.sku && String(body.sku).trim()) || `${product.slug.toUpperCase()}-${size}`,
      stock: Math.max(0, Number(body.stock) || 0),
      price: body.price ? Number(body.price) : null,
    },
  });

  return NextResponse.json({ variant }, { status: 201 });
}
