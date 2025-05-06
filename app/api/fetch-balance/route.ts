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

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const balances = await Balance.find().sort({ lastUpdate: -1 });

    if (!balances || balances.length === 0) {
      return sendResponse(404, "No balances found");
    }

    return sendResponse(200, "Balances fetched successfully", {
      balances
    });
  } catch (error) {
    console.error("Error fetching balances:", error);
    return sendResponse(500, "Internal Server Error");
  }
}