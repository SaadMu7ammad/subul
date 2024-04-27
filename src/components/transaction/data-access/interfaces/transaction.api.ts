import { ITransaction } from '.';

export type GetAllTransactionRequest= {}

export type GetAllTransactionResponse = {
  status: string;
  data: {
    allTransactions: (ITransaction | null)[];
  };
};

export interface IDataUpdateCaseInfo {
  user: { email: string }; //user email
  items: {
    name: string;//case id
  }[];
  externalTransactionId: string;
  orderId: string;
  amount: number;
  date: Date;
  paymentMethodType: 'card' | 'wallet';
  status: 'failed' | 'success' | 'refunded' | 'pending';
  currency: string;
  secretInfoPayment: string;
}

export type UpdateCaseInfoResponse = {
  status: string;
  data: ITransaction;
} | undefined;