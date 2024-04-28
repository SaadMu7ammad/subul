export interface TransactionPaymentInfo {
  onlineCard?: {
    lastFourDigits: string;
  };
  mobileWallet?: {
    number: string;
  };
  // _id: mongoose.Types.ObjectId;
}



