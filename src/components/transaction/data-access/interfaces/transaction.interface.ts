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

