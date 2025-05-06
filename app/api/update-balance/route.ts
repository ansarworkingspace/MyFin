import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db.config";
import Balance from "@/app/models/Balance";

const sendResponse = (status: number, message: string, data?: any) => {
  return NextResponse.json(
    { success: status < 400, message, data },
    { status }
  );
};

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const { account, currentBal } = await req.json();

    // Validate required fields
    if (!account || currentBal === undefined) {
      return sendResponse(400, "Account and currentBal are required");
    }

    // Find and update the balance
    const updatedBalance = await Balance.findOneAndUpdate(
      { account },
      { currentBal, lastUpdate: new Date() },
      { new: true }
    );

    if (!updatedBalance) {
      return sendResponse(404, "Account not found");
    }

    return sendResponse(200, "Balance updated successfully", {
      balance: updatedBalance
    });
  } catch (error) {
    console.error("Error updating balance:", error);
    return sendResponse(500, "Internal Server Error");
  }
}