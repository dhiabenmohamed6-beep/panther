import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return NextResponse.json({
    brandName: settings.brandName,
    logo: settings.logo,
    tagline: settings.tagline,
    instagramUrl: settings.instagramUrl,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    shippingPrice: settings.shippingPrice,
    freeShippingOver: settings.freeShippingOver,
    currency: settings.currency,
    storeStatus: settings.storeStatus,
    maintenanceMode: settings.maintenanceMode,
  });
}
