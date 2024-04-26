import { adminRepository } from '../data-access/admin.repository';
import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components/index';
import mongoose from 'mongoose';
import {
  AllPendingRequestsCharitiesResponse,
  CharitiesAccountsByAggregation,
  CharityPaymentMethodBankAccount,
  CharityPaymentMethodFawry,
  CharityPaymentMethodVodafoneCash,
  ConfirmPendingCharity,
  ConfirmedCharities,
  DataForForConfirmedCharity,
  ICharityDocs,
  PendingCharities,
} from '../../charity/data-access/interfaces';
// import { AllPendingRequestsCharitiesResponse, PendingCharities } from '../../charity/data-access/interfaces';
// import {
// CharitiesAccountsByAggregation,
// CharityPaymentMethodBankAccount,
// CharityPaymentMethodFawry,
// CharityPaymentMethodVodafoneCash,
// DataForPaymentRequestsForConfirmedCharity,
// AllPaymentAccounts,
// AllPendingRequestsCharitiesResponse,
// ConfirmPendingCharity,
// ConfirmedCharities,
// ICharityDocs,
// } from '../../charity/data-access/interfaces/charity.interface';
import { adminUtils } from './admin.utils';
import { setupMailSender } from '../../../utils/mailer';
// import { setupMailSender } from '../../../utils/mailer';

export type QueryObject = {
  $and: {
    isPending?: boolean;
    isEnabled?: boolean;
    isConfirmed?: boolean;
    $or?: { [key: string]: boolean }[];
    _id?: mongoose.Types.ObjectId | string;
  }[];
};

const getAllOrOnePendingRequestsCharities = async (
  id: string | null = null
) => {
  const queryObject: QueryObject = {
    $and: [
      { isPending: true },
      { isEnabled: true },
      { isConfirmed: false },
      {
        $or: [
          { 'emailVerification.isVerified': true },
          { 'phoneVerification.isVerified': true },
        ],
      },
      id ? { _id: id } : {}, // to find by Id only one
      // id ? { _id: new mongoose.Types.ObjectId(id) } : {},
    ],
  };
  const allPendingCharities: PendingCharities[] =
    await adminRepository.findAllPendingCharities(
      queryObject,
      'name email charityDocs paymentMethods'
    );

  // console.log(allPendingCharities[0]); // { selection }

  if (id && !allPendingCharities[0])
    throw new BadRequestError('charity not found');

  return { allPendingCharities: allPendingCharities };
};

const confirmPaymentAccountRequestForConfirmedCharities = async (
  charityId: string,
  // paymentMethod: string, // Allows any string value, which could include invalid keys
  paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
  paymentAccountID: string
): Promise<ConfirmPendingCharity> => {
  // Convert charityId to a mongoose.Types.ObjectId
  // const CharityObjectId: mongoose.Types.ObjectId = mongoose.Types.ObjectId(charityId);
  const queryObject: QueryObject = {
    $and: [
      { isPending: false },
      { isEnabled: true },
      { isConfirmed: true },
      {
        $or: [
          { 'emailVerification.isVerified': true },
          { 'phoneVerification.isVerified': true },
        ],
      },
      { _id: charityId },
      // { _id: CharityObjectId },
    ],
  };
  const charity: ConfirmedCharities = await adminUtils.getConfirmedCharities(
    queryObject
  );

  const idx: number = adminUtils.checkPaymentMethodAvailability(
    charity,
    paymentMethod,
    paymentAccountID
  );

  await adminUtils.confirmingPaymentAccount(charity, paymentMethod, idx);

  await setupMailSender(
    charity.email,
    'Charity payment account has been confirmed successfully',
    `<h2>after reviewing the payment account docs we accept it </h2><h2>now you are ready to help the world with us by start to share cases need help </h2>`
  );

  return {
    charity: charity,
    message: 'Charity payment account has been confirmed successfully',
  };
};

// const rejectPaymentAccountRequestForConfirmedCharities = async (
//   charityId: string,
//   // paymentMethod: string, // Allows any string value, which could include invalid keys
//   paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
//   paymentAccountID: string
// ): Promise<ConfirmPendingCharity> => {
//   const queryObject: QueryObject = {
//     $and: [
//       { isPending: false },
//       { isEnabled: true },
//       { isConfirmed: true },
//       {
//         $or: [
//           { 'emailVerification.isVerified': true },
//           { 'phoneVerification.isVerified': true },
//         ],
//       },
//       { _id: charityId },
//     ],
//   };

//   const charity: ConfirmedCharities = await adminUtils.getConfirmedCharities(
//     queryObject
//   );

//   const idx: number = adminUtils.checkPaymentMethodAvailability(
//     charity,
//     paymentMethod,
//     paymentAccountID
//   );

//   await adminUtils.rejectingPaymentAccount(charity, paymentMethod, idx);

//   await setupMailSender(
//     charity.email,
//     'Charity payment account has been rejected',
//     `<h2>after reviewing the payment account docs we reject it </h2><h2>you can re upload the docs again, BeCareful to add correct info</h2>`
//   );
//   return {
//     charity: charity,
//     message: 'Charity payment account has been rejected',
//   };
// };

// That mean if charity makes a requestEditCharityPayment (add another acc for receive payment)
const getPendingPaymentRequestsForConfirmedCharityById = async (id: string) => {
  const queryObject: QueryObject = {
    $and: [
      { isPending: false },
      { isEnabled: true },
      { isConfirmed: true },
      {
        $or: [
          { 'emailVerification.isVerified': true },
          { 'phoneVerification.isVerified': true },
        ],
      },
      id ? { _id: id } : {}, // to find by Id only one
    ],
  };
  const paymentRequests: DataForForConfirmedCharity =
    await adminRepository.findConfirmedCharityById(
      queryObject,
      'paymentMethods _id'
    );

  if (!paymentRequests) throw new BadRequestError('charity not found');

  let bankAccount: CharityPaymentMethodBankAccount[] | undefined =
    paymentRequests.paymentMethods?.bankAccount.filter(
      (acc: CharityPaymentMethodBankAccount) => acc.enable === false
    );

  let fawry: CharityPaymentMethodFawry[] | undefined =
    paymentRequests.paymentMethods?.fawry.filter(
      (acc: CharityPaymentMethodFawry) => acc.enable === false
    );

  let vodafoneCash: CharityPaymentMethodVodafoneCash[] | undefined =
    paymentRequests.paymentMethods?.vodafoneCash.filter(
      (acc: CharityPaymentMethodVodafoneCash) => acc.enable === false
    );

  // RETURNS ONLY THE NEW REQUEST ACC TO BE APPROVED👇
  return { paymentRequestsAccounts: { bankAccount, fawry, vodafoneCash } };
};

const getAllRequestsPaymentMethodsForConfirmedCharities = async () => {
  const bankAccountRequests: CharitiesAccountsByAggregation[] =
    await adminUtils.getAllPendingPaymentMethodsRequestsForConfirmedCharity(
      'bankAccount'
    ); // [ { _id, name, paymentMethods }, { }, ... ]

  const fawryRequests: CharitiesAccountsByAggregation[] =
    await adminUtils.getAllPendingPaymentMethodsRequestsForConfirmedCharity(
      'fawry'
    );

  const vodafoneCashRequests: CharitiesAccountsByAggregation[] =
    await adminUtils.getAllPendingPaymentMethodsRequestsForConfirmedCharity(
      'vodafoneCash'
    );

  if (!bankAccountRequests && !fawryRequests && !vodafoneCashRequests)
    throw new BadRequestError('No paymentRequests found');

  return {
    allPaymentAccounts: {
      bankAccountRequests,
      fawryRequests,
      vodafoneCashRequests,
    },
  };
};

const confirmCharity = async (id: string): Promise<ConfirmPendingCharity> => {
  // const charity: AllPendingRequestsCharitiesResponse =
  //   await getAllOrOnePendingRequestsCharities(id);
  const charity = await getAllOrOnePendingRequestsCharities(id);
  // { allPendingCharities: allPendingCharities }

  const pendingCharity: PendingCharities | undefined =
    charity.allPendingCharities[0];

  if (!pendingCharity) throw new NotFoundError('Charity not found');

  await adminUtils.confirmingCharity(pendingCharity);

  await setupMailSender(
    pendingCharity.email,
    'Charity has been confirmed successfully',
    `<h2>after reviewing the charity docs we accept it </h2><h2>now you are ready to help the world with us by start to share cases need help </h2>`
  );

  return {
    charity: charity.allPendingCharities[0],
    message: 'Charity has been confirmed successfully',
  };
};

const rejectCharity = async (id: string): Promise<ConfirmPendingCharity> => {
  const charity: AllPendingRequestsCharitiesResponse =
    await getAllOrOnePendingRequestsCharities(id);

  const pendingCharity: PendingCharities | undefined =
    charity.allPendingCharities[0];

  if (!pendingCharity) throw new NotFoundError('Charity not found');

  await adminUtils.rejectingCharity(pendingCharity);

  await setupMailSender(
    pendingCharity.email,
    'Charity has not been confirmed',
    `<h2>you must upload all the docs mentioned to auth the charity and always keep the quality of uploadings high and clear</h2>`
  );

  return {
    charity: charity.allPendingCharities[0],
    message: 'Charity has not been confirmed',
  };
};

export const adminService = {
  getAllOrOnePendingRequestsCharities,
  confirmCharity,
  rejectCharity,
  //   rejectPaymentAccountRequestForConfirmedCharities,
  confirmPaymentAccountRequestForConfirmedCharities,
  getAllRequestsPaymentMethodsForConfirmedCharities,
  getPendingPaymentRequestsForConfirmedCharityById,
};
