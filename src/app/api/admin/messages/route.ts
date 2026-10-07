import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.trim();

  const messages = await prisma.contactMessage.findMany({
    where: status && status !== "ALL" ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ messages });
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const body = await request.json();
  const id = String(body.id || "");
  const status = String(body.status || "");

  if (!id || !status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  }

  const updated = await prisma.contactMessage.update({ where: { id }, data: { status } });

  return NextResponse.json({ message: updated });
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  await prisma.contactMessage.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}