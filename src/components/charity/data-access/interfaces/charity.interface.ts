type Unpacked<T> = T extends (infer U)[] ? U : T;

export type ICharityPaymentMethods = Exclude<
  ICharity['paymentMethods'],
  undefined
>;

type PaymentMethodsNames = keyof ICharityPaymentMethods;

export type ICharityPaymentMethod= {
  [k in PaymentMethodsNames]:Unpacked<ICharityPaymentMethods[k]>; 
}


export type ICharityDocs = {
  charityDocs: Exclude<ICharity['charityDocs'], undefined>;
  paymentMethods: ICharityPaymentMethod;
};

export type ICharityDonorRequest = Exclude<
  ICharity['donorRequests'][0],
  undefined
>;

export type ICharityLocation = ICharity['charityLocation'][0];
