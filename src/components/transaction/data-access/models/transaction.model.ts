import mongoose, { Schema } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { InferSchemaType } from 'mongoose';

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

const transactionSchema = new Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cases',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
      required: true,
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

declare module '../interfaces/' {
  export type ITransaction = HydratedDocument<InferSchemaType<typeof transactionSchema>>;
}

const TransactionModel = mongoose.model('Transaction', transactionSchema);

export default TransactionModel;
