import { NextResponse } from "next/server";
import { updateAllUserInvoices } from "@/app/_actions/invoices/invoices-update-routine/update-all-user-invoces";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await updateAllUserInvoices();
    return NextResponse.json(
      { message: "Invoices updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating invoices:", error);
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update invoices" },
      { status: 500 },
    );
  }
}
