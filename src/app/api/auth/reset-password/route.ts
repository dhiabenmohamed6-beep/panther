import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const token = String(body?.token || "").trim();
  const password = String(body?.password || "");

  if (!token) {
    return NextResponse.json({ error: "Reset link is invalid or has expired" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record || record.usedAt || record.expires < new Date()) {
    return NextResponse.json({ error: "Reset link is invalid or has expired" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: record.email } });

  if (!user) {
    return NextResponse.json({ error: "Reset link is invalid or has expired" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { password: hashSync(password) },
    });
    await tx.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });
    await tx.passwordResetToken.deleteMany({
      where: { email: record.email, usedAt: null },
    });
  });

  return NextResponse.json({ ok: true });
}