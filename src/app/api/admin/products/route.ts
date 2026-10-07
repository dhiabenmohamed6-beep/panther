import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, slugify } from "@/lib/admin-guard";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const products = await prisma.product.findMany({
    include: { images: { orderBy: { position: "asc" } }, variants: { orderBy: { size: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }

  const baseSlug = slugify(body.slug || name) || `product-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const variantsInput = Array.isArray(body.variants) ? body.variants : [];
  const sizes = variantsInput.length
    ? variantsInput
    : [{ size: "M", stock: 0, price: null, sku: "" }];

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: body.description ? String(body.description) : null,
      price: Number(body.price) || 0,
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      discountPercent: body.discountPercent ? Number(body.discountPercent) : 0,
      discountActive: Boolean(body.discountActive),
      status: body.status || "DRAFT",
      featured: Boolean(body.featured),
      images: {
        create: (Array.isArray(body.images) ? body.images : []).map((img: { url: string; alt?: string }, index: number) => ({
          url: img.url,
          alt: img.alt || name,
          position: index,
        })),
      },
      variants: {
        create: sizes.map((v: { size: string; stock: number; price?: number | null; sku?: string }, index: number) => {
          const size = String(v.size || `SIZE-${index + 1}`).toUpperCase();
          return {
            size,
            sku: (v.sku && String(v.sku).trim()) || `${slug.toUpperCase()}-${size}`,
            stock: Number(v.stock) || 0,
            price: v.price ? Number(v.price) : null,
          };
        }),
      },
    },
    include: { images: true, variants: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}
