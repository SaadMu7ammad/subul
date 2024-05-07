import { ICharity, ICharityPaymentMethod } from '.';

export type ICharityDocs = {
  charityDocs: Exclude<ICharity['charityDocs'], undefined>;
  paymentMethods: ICharityPaymentMethod;
};

export type ICharityDonorRequest = Exclude<
  ICharity['donorRequests'][0],
  undefined
>;

export type ICharityLocation = ICharity['charityLocation'][0];
