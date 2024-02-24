import mongoose from 'mongoose';

export interface TransactionPaymentInfo {
  onlineCard: {
    lastFourDigits?: string;
  };
  mobileWallet: {
    number?: string;
  };
  _id: mongoose.Types.ObjectId;
}

export interface ITransaction {
  case?: Case['_id'] | Case;
  user?: User['_id'] | User;
  moneyPaid: number;
  paidAt?: Date;
  externalTransactionId: string;
  orderId: string;
  status?: 'pending' | 'success' | 'failed' | 'refunded';
  currency: string;
  paymentGateway: string;
  paymentInfo?: TransactionPaymentInfo;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// export type TransactionPaymentInfoDocument =
//   mongoose.Document<mongoose.Types.ObjectId> & {
//     onlineCard: {
//       lastFourDigits?: string;
//     };
//     mobileWallet: {
//       number?: string;
//     };
//     _id: mongoose.Types.ObjectId;
//   };

// export type TransactionDocument = mongoose.Document<
//   mongoose.Types.ObjectId,
//   TransactionQueries
// > &
//   TransactionMethods & {
//     case?: CaseDocument['_id'] | CaseDocument;
//     user?: UserDocument['_id'] | UserDocument;
//     moneyPaid: number;
//     paidAt?: Date;
//     externalTransactionId: string;
//     orderId: string;
//     status?: 'pending' | 'success' | 'failed' | 'refunded';
//     currency: string;
//     paymentGateway: string;
//     paymentInfo?: TransactionPaymentInfoDocument;
//     _id: mongoose.Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
//   };
