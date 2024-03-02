import mongoose, { Document } from 'mongoose';
import {  ICaseDocument } from '../../../case/data-access/interfaces/case.interface';
import {  IUserDocument } from '../../../user/data-access/interfaces/user.interface';

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
  case?: ICaseDocument['_id'] ;
  user?: IUserDocument['_id'] ;
  moneyPaid: number;
  paidAt?: Date;
  externalTransactionId: string;
  orderId: string;
  status?: 'pending' | 'success' | 'failed' | 'refunded';
  currency: string;
  paymentGateway: string;
  paymentInfo?: TransactionPaymentInfo;
  // _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ITransactionDocument extends ITransaction, Document { }

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
