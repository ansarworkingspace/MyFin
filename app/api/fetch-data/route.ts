import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db.config";
import Transaction from "@/app/models/Transaction";

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

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const account = searchParams.get('account') || 'expense';
    const month = searchParams.get('month');
    
    // Calculate date range
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = month ? currentDate.getFullYear() : currentDate.getFullYear();
    
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    // Build query
    const query = {
      account,
      dateOfTransaction: {
        $gte: startDate,
        $lte: endDate
      }
    };

    const transactions = await Transaction.find(query).sort({ dateOfTransaction: -1 });

    if (!transactions || transactions.length === 0) {
      return sendResponse(404, "No transactions found");
    }

    return sendResponse(200, "Transactions fetched successfully", {
      transactions
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return sendResponse(500, "Internal Server Error");
  }
}