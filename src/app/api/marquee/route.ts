import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const messages = await prisma.marqueeMessage.findMany({
    where: { enabled: true },
    orderBy: { position: "asc" },
  });

  return NextResponse.json({ messages });
}
