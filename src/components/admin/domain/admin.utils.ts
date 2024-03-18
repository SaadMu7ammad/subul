import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components/index';
import { deleteOldImgs } from '../../../utils/deleteFile';
import {
  CharitiesAccountsByAggregation,
  CharityPaymentMethodBankAccount,
  CharityPaymentMethodFawry,
  CharityPaymentMethodVodafoneCash,
  ConfirmedCharities,
  ICharityDocs,
  ICharityPaymentMethodDocument,
  PendingCharities,
} from '../../charity/data-access/interfaces/';
import { adminRepository } from '../data-access/admin.repository';
import { QueryObject } from './admin.service';

const getAllPendingPaymentMethodsRequestsForConfirmedCharity = async (
  paymentMethod: string // bankAccount | fawry...
): Promise<CharitiesAccountsByAggregation[]> => {
  const paymentMethodRequests: CharitiesAccountsByAggregation[] =
    await adminRepository.getPendingPaymentAccountByAggregation(paymentMethod);

  return paymentMethodRequests; // []
};

const confirmingCharity = async (charity: PendingCharities): Promise<void> => {
  charity.isPending = false;
  charity.isConfirmed = true;
  //enable all paymentMethods when first time the charity send the docs
  if (charity && charity.paymentMethods) {
    charity.paymentMethods.bankAccount.forEach((item) => {
      item.enable = true;
    });
    charity.paymentMethods.fawry.forEach((item) => {
      item.enable = true;
    });
    charity.paymentMethods.vodafoneCash.forEach((item) => {
      item.enable = true;
    });
  }
  await charity.save();
};

// const rejectingCharity = async (charity: ICharityDocument) => {
const rejectingCharity = async (charity: PendingCharities) => {
  charity.isPending = false;
  charity.isConfirmed = false;
  // console.log('charity', charity); // { charityDocs:{ docs1: []... }, _id, email, name, paymentMethod: {} }
  // for (let i = 1; i <= 4; ++i) {
  //   deleteOldImgs('charityDocs', charity.charityDocs['docs' + i]);
  // }
  // charity.charityDocs = {};

  // U can't use the indexing operation with the string 'docs' + i on it without ensuring it's defined.
  if (charity.charityDocs) {
    for (let i = 1; i <= 4; ++i) {
      const docsKey = ('docs' + i) as keyof typeof charity.charityDocs;
      // Check if the property exists in charity.charityDocs
      if (charity.charityDocs.hasOwnProperty(docsKey)) {
        deleteOldImgs('charityDocs', charity.charityDocs[docsKey]);
      }
    }
  }
  charity.charityDocs = {
    docs1: [],
    docs2: [],
    docs3: [],
    docs4: [],
  };

  // Map => Associate each payment method with its corresponding document type or field.
  const paymentMethods = new Map([
    ['bankAccount', 'bankDocs'],
    ['fawry', 'fawryDocs'],
    ['vodafoneCash', 'vodafoneCashDocs'],
  ]);

  if (charity.paymentMethods) {
    for (let [method, docs] of paymentMethods) {
      const methodKey = method as keyof typeof charity.paymentMethods;
      charity.paymentMethods[methodKey]?.forEach(
        (acc: Partial<ICharityPaymentMethodDocument>) => {
          // console.log(acc[docs]); // [] of string
          const docsValue: string | string[] =
            acc[docs as keyof Partial<ICharityPaymentMethodDocument>];
          // if (typeof docsValue === 'string' || Array.isArray(docsValue)) {
          // deleteOldImgs('charityDocs', docsValue);
          // }
          deleteOldImgs('charityDocs', docsValue);
        }
      );
      charity.paymentMethods[methodKey] = [];
    }
  }
  await charity.save();
};

const checkPaymentMethodAvailability = (
  // charity: ICharityDocument,
  charity: ConfirmedCharities,
  paymentMethod: string,
  paymentAccountID: string
): number => {
  if (
    paymentMethod !== 'bankAccount' &&
    paymentMethod !== 'vodafoneCash' &&
    paymentMethod !== 'fawry'
  ) {
    throw new BadRequestError('Invalid Payment Method type');
  }

  // charity.paymentMethods => [ { enable number paymentDocs _id } ]
  if (!charity.paymentMethods)
    throw new NotFoundError('Not found any payment methods');

  const idx: number = charity.paymentMethods[paymentMethod].findIndex(
    (item: Partial<ICharityPaymentMethodDocument>) =>
      item._id?.toString() === paymentAccountID
  );
  if (idx === -1) throw new BadRequestError('not found Payment Method account');

  return idx;
};

const getConfirmedCharities = async (
  queryObject: QueryObject
): Promise<ConfirmedCharities> => {
  // [ { name email paymentMethods _id } ]
  const charities: ConfirmedCharities[] =
    await adminRepository.findCharitiesByQueryWithOptionalId(
      queryObject,
      'name email paymentMethods'
    );

  if (!charities[0]) throw new BadRequestError('charity not found');

  return charities[0]; // { name email paymentMethods _id }
};

const confirmingPaymentAccount = async (
  charity: ConfirmedCharities,
  // paymentMethod: string, // Allows any string value, which could include invalid keys
  paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
  idx: number
): Promise<void> => {
  if (!charity.paymentMethods)
    throw new NotFoundError('Not found any payment methods');

  // if (charity.paymentMethods[paymentMethod][idx].enable === false) {
  // charity.paymentMethods[paymentMethod][idx].enable = true;
  // } else {
  //   throw new BadRequestError('Already this payment account is enabled');
  // }

  type PaymentMethod =
    | CharityPaymentMethodBankAccount
    | CharityPaymentMethodFawry
    | CharityPaymentMethodVodafoneCash;

  const paymentMethodData = charity.paymentMethods[
    paymentMethod
  ] as PaymentMethod[]; // [ { } ]

  const paymentAccount = paymentMethodData[idx] as PaymentMethod; // { }

  if (paymentAccount.enable === false) {
    paymentAccount.enable = true;
  } else {
    throw new BadRequestError('Already this payment account is enabled');
  }

  await charity.save();
};

const rejectingPaymentAccount = async (
  charity: ConfirmedCharities,
  // paymentMethod: string, // Allows any string value, which could include invalid keys
  paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
  idx: number
): Promise<void> => {
  if (!charity.paymentMethods)
    throw new NotFoundError('Not found any payment methods');

  type PaymentMethod =
    | CharityPaymentMethodBankAccount
    | CharityPaymentMethodFawry
    | CharityPaymentMethodVodafoneCash;

  const paymentMethodData = charity.paymentMethods[
    paymentMethod
  ] as PaymentMethod[]; // [ { } ]

  const paymentAccount = paymentMethodData[idx] as PaymentMethod; // { }

  if (paymentAccount.enable === false) {
    throw new BadRequestError('Already this payment account is enabled');
  }

  let urlOldImage: string[] | null = null;

  // TypeScript only allows access to properties that are common to all types in a union.
  if (paymentMethod === 'vodafoneCash') {
    const vodafoneCashAccount =
      paymentAccount as CharityPaymentMethodVodafoneCash;
    urlOldImage = vodafoneCashAccount.vodafoneCashDocs;
  } else if (paymentMethod === 'bankAccount') {
    const bankAccount = paymentAccount as CharityPaymentMethodBankAccount;
    urlOldImage = bankAccount.bankDocs;
  } else if (paymentMethod === 'fawry') {
    const fawryAccount = paymentAccount as CharityPaymentMethodFawry;
    urlOldImage = fawryAccount.fawryDocs;
  }

  paymentMethodData.splice(idx, 1); // Removing 1 acc at index idx
  if (urlOldImage) {
    deleteOldImgs('charityDocs', urlOldImage);
  } else {
    throw new BadRequestError('No docs found for that account');
  }
  await charity.save();

  // if (charity.paymentMethods[paymentMethod][idx].enable === true)
  //   throw new BadRequestError('Already this payment account is enabled');

  // let urlOldImage: string | null = null;

  // if (paymentMethod === 'bankAccount') {
  //   urlOldImage = charity.paymentMethods[paymentMethod][idx].bankDocs;
  // } else if (paymentMethod === 'vodafoneCash') {
  //   urlOldImage = charity.paymentMethods[paymentMethod][idx].vodafoneCashDocs;
  // } else if (paymentMethod === 'fawry') {
  //   urlOldImage = charity.paymentMethods[paymentMethod][idx].fawryDocs;
  // }

  // charity.paymentMethods[paymentMethod].splice(idx, 1); //delete the account
  // // url: 'http://localhost:5000/charityDocs/bankDocs-name.jpeg';
  // // const url = path.join('./uploads/charityDocs', charity.paymentMethods[paymentMethod][idx].fawryDocs[0])
  // if (urlOldImage) {
  //   deleteOldImgs('charityDocs', urlOldImage);
  // } else {
  //   throw new BadRequestError('No docs found for that account');
  // }

  // await charity.save();
};
export const adminUtils = {
  getAllPendingPaymentMethodsRequestsForConfirmedCharity,
  confirmingCharity,
  rejectingCharity,
  checkPaymentMethodAvailability,
  getConfirmedCharities,
  confirmingPaymentAccount,
  rejectingPaymentAccount,
};
