import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const athletes = await prisma.athlete.findMany({
    orderBy: { position: "asc" },
  });

  return NextResponse.json({ athletes });
}
