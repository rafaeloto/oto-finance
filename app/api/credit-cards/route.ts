import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creditCards = await db.creditCard.findMany({
    where: { userId },
  });

  return NextResponse.json(creditCards);
}
