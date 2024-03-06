import { adminRepository } from '../data-access/admin.repository';
import { BadRequestError } from '../../../libraries/errors/components/index';
// import { setupMailSender } from '../../../utils/mailer';
// import { adminUtils } from './admin.utils';
// import {
//   //   CharityPaymentMethodBankAccount,
//   //   CharityPaymentMethodFawry,
//   //   CharityPaymentMethodVodafoneCash,
//   // ICharityDocument,
//   QueryObject,
// } from '../../charity/data-access/interfaces/charity.interface';

type QueryObject = {
  $and: {
    isPending?: boolean;
    isEnabled?: boolean;
    isConfirmed?: boolean;
    $or?: { [key: string]: boolean }[];
    _id?: string; // Include _id as an optional field
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
      ...(id ? [{ _id: id }] : []),
      // id ? { _id: id } : {}, // to find by Id only one
      // id ? { _id: id } : new mongoose.Types.ObjectId(),
      // { _id: id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId() },
    ],
  };
  // console.log('queryObject', queryObject);
  // {
  //   '$and': [
  //     { isPending: true },
  //     { isEnabled: true },
  //     { isConfirmed: false },
  //     { '$or': [Array] },
  //     {}
  //   ]
  // }
  const allPendingCharities = await adminRepository.findAllPendingCharities(
    queryObject,
    'name email charityDocs paymentMethods'
  );

  if (id && !allPendingCharities[0])
    throw new BadRequestError('charity not found');
  return { allPendingCharities: allPendingCharities };
};

// const confirmPaymentAccountRequestForConfirmedCharities = async (
//   charityId: string,
//   paymentMethod: string,
//   paymentAccountID: string
// ) => {
//   const queryObject = {
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
//   const charity = await adminUtils.getConfirmedCharities(queryObject);

//   const idx: number = adminUtils.checkPaymentMethodAvailability(
//     charity,
//     paymentMethod,
//     paymentAccountID
//   );

//   await adminUtils.confirmingPaymentAccount(charity, paymentMethod, idx);

//   await setupMailSender(
//     charity.email,
//     'Charity payment account has been confirmed successfully',
//     `<h2>after reviewing the payment account docs we accept it </h2><h2>now you are ready to help the world with us by start to share cases need help </h2>`
//   );

//   return {
//     charity: charity,
//     message: 'Charity payment account has been confirmed successfully',
//   };
// };

// const rejectPaymentAccountRequestForConfirmedCharities = async (
//   charityId: string,
//   paymentMethod: string,
//   paymentAccountID: string
// ) => {
//   const queryObject = {
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
//   const charity = await adminUtils.getConfirmedCharities(queryObject);

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
// const getPendingPaymentRequestsForConfirmedCharityById = async (id: string) => {
//   const queryObject = {
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
//       { _id: id },
//     ],
//   };
//   const paymentRequests: any = await adminRepository.findConfirmedCharityById(
//     queryObject,
//     'paymentMethods _id'
//   );

//   if (!paymentRequests) throw new BadRequestError('charity not found');

//   let bankAccount = paymentRequests.paymentMethods.bankAccount.filter(
//     (acc: CharityPaymentMethodBankAccount) => acc.enable === false
//   );

//   let fawry = paymentRequests.paymentMethods.fawry.filter(
//     (acc: CharityPaymentMethodFawry) => acc.enable === false
//   );

//   let vodafoneCash = paymentRequests.paymentMethods.vodafoneCash.filter(
//     (acc: CharityPaymentMethodVodafoneCash) => acc.enable === false
//   );

//   return { paymentRequestsAccounts: { bankAccount, fawry, vodafoneCash } };
// };
// const getAllRequestsPaymentMethodsForConfirmedCharities = async () => {
//   const bankAccountRequests =
//     await adminUtils.getAllPendingPaymentMethodsRequestsForConfirmedCharity(
//       'bankAccount'
//     );
//   const fawryRequests =
//     await adminUtils.getAllPendingPaymentMethodsRequestsForConfirmedCharity(
//       'fawry'
//     );
//   const vodafoneCashRequests =
//     await adminUtils.getAllPendingPaymentMethodsRequestsForConfirmedCharity(
//       'vodafoneCash'
//     );

//   if (!bankAccountRequests && !fawryRequests && !vodafoneCashRequests)
//     throw new BadRequestError('No paymentRequests found');
//   return {
//     allPaymentAccounts: {
//       bankAccountRequests,
//       fawryRequests,
//       vodafoneCashRequests,
//     },
//   };
// };
// const confirmCharity = async (id: string) => {
//   const charity = await getAllOrOnePendingRequestsCharities(id);
//   const pendingCharity = charity.allPendingCharities[0] as ICharityDocument;
//   await adminUtils.confirmingCharity(pendingCharity);
//   await setupMailSender(
//     pendingCharity.email,
//     'Charity has been confirmed successfully',
//     `<h2>after reviewing the charity docs we accept it </h2><h2>now you are ready to help the world with us by start to share cases need help </h2>`
//   );
//   return {
//     charity: charity.allPendingCharities[0],
//     message: 'Charity has been confirmed successfully',
//   };
// };
// const rejectCharity = async (id: string) => {
//   const charity = await getAllOrOnePendingRequestsCharities(id);
//   const pendingCharity = charity.allPendingCharities[0] as ICharityDocument;
//   await adminUtils.rejectingCharity(pendingCharity);
//   await setupMailSender(
//     pendingCharity.email,
//     'Charity has not been confirmed',
//     `<h2>you must upload all the docs mentioned to auth the charity and always keep the quality of uploadings high and clear</h2>`
//   );
//   return {
//     charity: charity.allPendingCharities[0],
//     message: 'Charity has not been confirmed',
//   };
// };
export const adminService = {
  getAllOrOnePendingRequestsCharities,
  //   confirmCharity,
  //   rejectCharity,
  //   rejectPaymentAccountRequestForConfirmedCharities,
  //   confirmPaymentAccountRequestForConfirmedCharities,
  //   getAllRequestsPaymentMethodsForConfirmedCharities,
  //   getPendingPaymentRequestsForConfirmedCharityById,
};
