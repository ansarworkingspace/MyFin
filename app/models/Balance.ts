import mongoose, { Schema, Document } from "mongoose";

export interface IBalance extends Document {
  account: "savings" | "expense" | "cash";
  currentBal: number;
  lastUpdate: Date;
}

const BalanceSchema: Schema = new Schema({
  account: {
    type: String,
    enum: ["savings", "expense", "cash"],
    required: true,
    unique: true,
  },
  currentBal: {
    type: Number,
    required: true,
    default: 0,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Balance ||
  mongoose.model<IBalance>("Balance", BalanceSchema);
