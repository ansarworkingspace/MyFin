import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  category: 'expense' | 'income';
  amount: number;
  account: 'savings' | 'expense' | 'cash';
  dateOfTransaction: Date;
  createdDate: Date;
  note: string;
}

const TransactionSchema: Schema = new Schema({
  category: {
    type: String,
    enum: ['expense', 'income'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  account: {
    type: String,
    enum: ['savings', 'expense', 'cash'],
    required: true
  },
  dateOfTransaction: {
    type: Date,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    required: false,
    default: ''
  }
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);