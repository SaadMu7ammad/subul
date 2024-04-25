export interface TransactionPaymentInfo {
  onlineCard?: {
    lastFourDigits: string;
  };
  mobileWallet?: {
    number: string;
  };
  // _id: mongoose.Types.ObjectId;
}

export interface IDataPreCreateTransaction {
  charityId: string;
  caseId: string;
  amount: number;
  mainTypePayment: string;
}

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
