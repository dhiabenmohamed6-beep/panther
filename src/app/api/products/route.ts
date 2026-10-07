import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const query = searchParams.get("q")?.trim();
  const featuredOnly = searchParams.get("featured") === "true";

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(slug ? { slug } : {}),
      ...(featuredOnly ? { featured: true } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
            ],
          }
        : {}),
    },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { size: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ products });
}
