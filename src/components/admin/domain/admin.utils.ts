// import { BadRequestError } from '../../../libraries/errors/components/index';
// import { deleteOldImgs } from '../../../utils/deleteFile';
// import { ICharityDocument } from '../../charity/data-access/interfaces/charity.interface';
// import { adminRepository } from '../data-access/admin.repository';

// const getAllPendingPaymentMethodsRequestsForConfirmedCharity = async (
//   paymentMethod: string
// ) => {
//   const paymentMethodRequests =
//     await adminRepository.getPendingPaymentAccountByAggregation(paymentMethod);
//   return paymentMethodRequests;
// };
// const confirmingCharity = async (charity: ICharityDocument) => {
//   charity.isPending = false;
//   charity.isConfirmed = true;
//   //enable all paymentMethods when first time the charity send the docs
//   if (charity && charity.paymentMethods) {
//     charity.paymentMethods.bankAccount.forEach((item) => {
//       item.enable = true;
//     });
//     charity.paymentMethods.fawry.forEach((item) => {
//       item.enable = true;
//     });
//     charity.paymentMethods.vodafoneCash.forEach((item) => {
//       item.enable = true;
//     });
//   }
//   await charity.save();
// };

// // const rejectingCharity = async (charity: ICharityDocument) => {
// const rejectingCharity = async (charity: any) => {
//   charity.isPending = false;
//   charity.isConfirmed = false;

//   for (let i = 1; i <= 4; ++i) {
//     deleteOldImgs('charityDocs', charity.charityDocs['docs' + i]);
//   }
//   charity.charityDocs = {};

//   const paymentMethods = new Map([
//     ['bankAccount', 'bankDocs'],
//     ['fawry', 'fawryDocs'],
//     ['vodafoneCash', 'vodafoneCashDocs'],
//   ]);

//   for (let [method, docs] of paymentMethods) {
//     charity.paymentMethods[method]?.forEach((acc: any) => {
//       deleteOldImgs('charityDocs', acc[docs]);
//     });
//     charity.paymentMethods[method] = [];
//   }

//   await charity.save();
// };

// const checkPaymentMethodAvailability = (
//   charity: ICharityDocument,
//   paymentMethod: string,
//   paymentAccountID: string
// ) => {
//   if (
//     paymentMethod !== 'bankAccount' &&
//     paymentMethod !== 'vodafoneCash' &&
//     paymentMethod !== 'fawry'
//   ) {
//     throw new BadRequestError('Invalid Payment Method type');
//   }

//   console.log();
//   // const idx: number = charity.paymentMethods[paymentMethod].findIndex(
//   //   (item) => item._id == paymentAccountID
//   // );

// //   if (idx === -1) throw new BadRequestError('not found Payment Method account');

// //   return idx;
// // };
// // const getConfirmedCharities = async (
// //   queryObject: any
// // ): Promise<ICharityDocument> => {
// //   const charities = await adminRepository.findCharitiesByQueryWithOptionalId(
// //     queryObject,
// //     'name email paymentMethods'
// //   );
// //   if (!charities[0]) throw new BadRequestError('charity not found');
// //   return charities[0];
// // };

// // const confirmingPaymentAccount = async (
// //   charity: ICharityDocument,
// //   paymentMethod: string,
// //   idx: number
// // ) => {
// //   if (charity.paymentMethods[paymentMethod][idx].enable === false) {
// //     charity.paymentMethods[paymentMethod][idx].enable = true;
// //   } else {
// //     throw new BadRequestError('Already this payment account is enabled');
// //   }
// //   await charity.save();
// // };
// // const rejectingPaymentAccount = async (
// //   charity: ICharityDocument,
// //   paymentMethod: string,
// //   idx: number
// // ) => {
// //   if (charity.paymentMethods[paymentMethod][idx].enable === true)
// //     throw new BadRequestError('Already this payment account is enabled');

// //   let urlOldImage: string | null = null;

// //   if (paymentMethod === 'bankAccount') {
// //     urlOldImage = charity.paymentMethods[paymentMethod][idx].bankDocs;
// //   } else if (paymentMethod === 'vodafoneCash') {
// //     urlOldImage = charity.paymentMethods[paymentMethod][idx].vodafoneCashDocs;
// //   } else if (paymentMethod === 'fawry') {
// //     urlOldImage = charity.paymentMethods[paymentMethod][idx].fawryDocs;
// //   }

// //   charity.paymentMethods[paymentMethod].splice(idx, 1); //delete the account
// //   // url: 'http://localhost:5000/charityDocs/bankDocs-name.jpeg';
// //   // const url = path.join('./uploads/charityDocs', charity.paymentMethods[paymentMethod][idx].fawryDocs[0])
// //   if (urlOldImage) {
// //     deleteOldImgs('charityDocs', urlOldImage);
// //   } else {
// //     throw new BadRequestError('No docs found for that account');
// //   }

// //   await charity.save();
// // };
export const adminUtils = {
  //   getAllPendingPaymentMethodsRequestsForConfirmedCharity,
  //   confirmingCharity,
  //   rejectingCharity,
  //   checkPaymentMethodAvailability,
  //   // getConfirmedCharities,
  //   // confirmingPaymentAccount,
  //   // rejectingPaymentAccount,
};
