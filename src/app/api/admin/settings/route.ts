import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const settings = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.brandName !== undefined) data.brandName = String(body.brandName);
  if (body.tagline !== undefined) data.tagline = String(body.tagline);
  if (body.logo !== undefined) data.logo = body.logo ? String(body.logo) : null;
  if (body.instagramUrl !== undefined) data.instagramUrl = String(body.instagramUrl);
  if (body.contactEmail !== undefined) data.contactEmail = String(body.contactEmail);
  if (body.contactPhone !== undefined) data.contactPhone = body.contactPhone ? String(body.contactPhone) : null;
  if (body.shippingPrice !== undefined) data.shippingPrice = Number(body.shippingPrice) || 0;
  if (body.freeShippingOver !== undefined) data.freeShippingOver = Number(body.freeShippingOver) || 0;
  if (body.currency !== undefined) data.currency = String(body.currency);
  if (body.storeStatus !== undefined) data.storeStatus = Boolean(body.storeStatus);
  if (body.maintenanceMode !== undefined) data.maintenanceMode = Boolean(body.maintenanceMode);

  const settings = await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  return NextResponse.json({ settings });
}
