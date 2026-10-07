import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  if (target.id === user.id) {
    return NextResponse.json({ error: "You cannot edit your own account here" }, { status: 400 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) data.name = body.name ? String(body.name) : null;
  if (body.email !== undefined && String(body.email).trim()) data.email = String(body.email).trim();
  if (body.role !== undefined) {
    const role = String(body.role).toUpperCase();
    if (!["CUSTOMER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    data.role = role;
  }
  if (body.password !== undefined && String(body.password)) {
    const { hashSync } = await import("bcrypt-ts-edge");
    data.password = hashSync(String(body.password), 10);
  }

  const customer = await prisma.user.update({ where: { id }, data });
  return NextResponse.json({
    customer: { id: customer.id, name: customer.name, email: customer.email, role: customer.role },
  });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const { id } = await params;
  if (id === user.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  await prisma.orderItem.deleteMany({ where: { order: { userId: id } } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
