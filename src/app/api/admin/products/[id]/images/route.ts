import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const body = await request.json();

  if (body.action === "replace-images") {
    const images = Array.isArray(body.images) ? body.images : [];
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productImage.createMany({
      data: images.map((img: Record<string, unknown>, index: number) => ({
        productId: id,
        url: String(img.url),
        alt: img.alt ? String(img.alt) : product.name,
        position: Number(img.position ?? index),
      })),
    });
  } else if (body.action === "add-image") {
    await prisma.productImage.create({
      data: {
        productId: id,
        url: String(body.url),
        alt: body.alt ? String(body.alt) : product.name,
        position: Number(body.position ?? 0),
      },
    });
  } else if (body.action === "delete-image") {
    await prisma.productImage.delete({ where: { id: String(body.imageId) } });
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const images = await prisma.productImage.findMany({
    where: { productId: id },
    orderBy: { position: "asc" },
  });

  return NextResponse.json({ images });
}
