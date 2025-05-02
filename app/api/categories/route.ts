import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@prisma/client";
import { getCategories } from "@/app/_data/getCategories";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as TransactionType;

  if (!type) {
    return NextResponse.json({ error: "Missing type" }, { status: 400 });
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await getCategories({ type });

  return NextResponse.json(categories);
}
