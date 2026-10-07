import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour
const MAX_ATTEMPTS_PER_HOUR = 5;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const recentCount = await prisma.passwordResetToken.count({
    where: { email, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
  });

  if (recentCount >= MAX_ATTEMPTS_PER_HOUR) {
    return NextResponse.json(
      { error: "Too many reset requests. Please try again in an hour." },
      { status: 429 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Never reveal whether an address exists: the response is identical either way.
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  await prisma.passwordResetToken.deleteMany({ where: { email, usedAt: null } });

  const token = randomBytes(32).toString("hex");

  await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expires: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const resetUrl = `/reset-password?token=${token}`;

  // No mail provider is configured. In development the link is returned so the
  // flow is usable end to end; configure SMTP before going live.
  const exposeLink = process.env.NODE_ENV !== "production";

  return NextResponse.json({
    ok: true,
    ...(exposeLink ? { resetUrl } : {}),
  });
}