import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const messages = await prisma.marqueeMessage.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const body = await request.json();
  const text = String(body.text || "").trim();
  if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

  const count = await prisma.marqueeMessage.count();
  const message = await prisma.marqueeMessage.create({
    data: {
      text,
      enabled: body.enabled === undefined ? true : Boolean(body.enabled),
      position: body.position !== undefined ? Number(body.position) : count,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
