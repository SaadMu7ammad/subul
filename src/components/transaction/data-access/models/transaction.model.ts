import mongoose, { Document, Schema } from 'mongoose';
import { ITransaction } from '../interfaces/transaction.interface';

const paymentMethodSchema = new Schema({
  onlineCard: {
    lastFourDigits: String,
  },
  mobileWallet: {
    number: String,
  },
  // name: {
  //   type: String,
  //   required: true,
  // },
  // bankAccount: {
  //   // accNumber: String,
  //   // iban: String,
  //   // swiftCode: String,
  // },
  // fawry: {
  //   number: String,
  // },
  // vodafoneCash: {
  //   number: String,
  // },
});

const transactionSchema: Schema<ITransaction & Document> = new Schema(
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
const TransactionModel = mongoose.model('Transaction', transactionSchema);

// const Transaction: TransactionModel = mongoose.model<
//     TransactionDocument,
//     TransactionModel
// >('Transaction', transactionSchema);

export default TransactionModel;
