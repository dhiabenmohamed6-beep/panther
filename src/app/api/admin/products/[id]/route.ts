import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, slugify } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, variants: { orderBy: { size: "asc" } } },
  });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.slug !== undefined) {
    const nextSlug = slugify(body.slug || String(body.name ?? existing.name));
    if (nextSlug && nextSlug !== existing.slug) {
      const taken = await prisma.product.findUnique({ where: { slug: nextSlug } });
      if (taken && taken.id !== id) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
      }
      data.slug = nextSlug;
    }
  }
  if (body.description !== undefined) data.description = body.description ? String(body.description) : null;
  if (body.price !== undefined) data.price = Number(body.price) || 0;
  if (body.compareAtPrice !== undefined) {
    data.compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : null;
  }
  if (body.discountPercent !== undefined) data.discountPercent = Number(body.discountPercent) || 0;
  if (body.discountActive !== undefined) data.discountActive = Boolean(body.discountActive);
  if (body.status !== undefined) data.status = String(body.status);
  if (body.featured !== undefined) data.featured = Boolean(body.featured);

  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ product });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  await prisma.orderItem.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
