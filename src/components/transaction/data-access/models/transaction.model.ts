import mongoose, { Document, Schema } from 'mongoose';
import { Transaction } from '../interfaces/transaction.interface';

const paymentMethodSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  // bankAccount: {
  //   // accNumber: String,
  //   // iban: String,
  //   // swiftCode: String,
  // },
  onlineCard: {
    lastFourDigits: String,
  },
  // fawry: {
  //   number: String,
  // },
  // vodafoneCash: {
  //   number: String,
  // },
  mobileWallet: {
    number: String,
  },
});

const transactionSchema: Schema<Transaction & Document> = new Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    moneyPaid: {
      type: Number,
      required: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    externalTransactionId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
    },
    currency: {
      type: String,
      required: true,
    },
    paymentGateway: {
      type: String,
      required: true,
      default: 'paymob',
    },
    paymentInfo: paymentMethodSchema,
  },
  { timestamps: true }
);
const TransactionModel = mongoose.model<Transaction>(
  'Transaction',
  transactionSchema
);

// const Transaction: TransactionModel = mongoose.model<
//     TransactionDocument,
//     TransactionModel
// >('Transaction', transactionSchema);

export default TransactionModel;
