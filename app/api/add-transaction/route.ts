import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db.config";
import Transaction from "@/app/models/Transaction";
import Balance from "@/app/models/Balance";

const sendResponse = (status: number, message: string, data?: any) => {
  return NextResponse.json(
    { success: status < 400, message, data },
    { status }
  );
};

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Validate required fields
    if (
      !body.category ||
      !body.amount ||
      !body.account ||
      !body.dateOfTransaction
    ) {
      return sendResponse(400, "Missing required fields");
    }

    // First delete any existing transaction with same date, category and account
    const inputDate = new Date(body.dateOfTransaction);
    const startOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const endOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 23, 59, 59, 999);

    // Find existing transactions before deleting them
    const existingTransactions = await Transaction.find({
      dateOfTransaction: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      category: body.category,
      account: body.account
    });

    // Reverse the balance for each existing transaction
    for (const transaction of existingTransactions) {
      const reverseAmount = transaction.category === "income" ? -transaction.amount : transaction.amount;
      await Balance.findOneAndUpdate(
        { account: transaction.account },
        { $inc: { currentBal: reverseAmount } },
        { new: true }
      );
    }

    // Delete the transactions
    await Transaction.deleteMany({
      dateOfTransaction: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      category: body.category,
      account: body.account
    });

    // Then create the new transaction
    const newTransaction = await Transaction.create({
      category: body.category,
      amount: body.amount,
      account: body.account,
      dateOfTransaction: new Date(body.dateOfTransaction),
      note: body.note || "",
    });

    // Update account balance
    const amount = body.category === "income" ? body.amount : -body.amount;
    await Balance.findOneAndUpdate(
      { account: body.account },
      { $inc: { currentBal: amount } },
      { new: true, upsert: true }
    );

    return sendResponse(201, "Transaction added successfully", {
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    return sendResponse(500, "Internal Server Error");
  }
}
