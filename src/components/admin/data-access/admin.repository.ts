import Charity from '../../charity/data-access/models/charity.model';
import { QueryObject } from '../domain/admin.service';

const findAllPendingCharities = async (
  queryObject: QueryObject,
  selection: string
) => {
  const pendingCharities = await Charity.find(queryObject, selection).exec();
  // .select('name email charityDocs paymentMethods')
  return pendingCharities;
};

// const findCharitiesByQueryWithOptionalId = async (
//   queryObject: any,
//   selection: string
// ) => {
//   const pendingCharities = await Charity.find(queryObject, selection).exec();
//   return pendingCharities;
// };
// const findConfirmedCharityById = async (
//   queryObject: any,
//   selection: string
// ) => {
//   const charity = await Charity.findOne(queryObject, selection).select('-_id'); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}
//   return charity;
// };
// const getPendingPaymentAccountByAggregation = async (paymentMethod: string) => {
//   const charity = await Charity.aggregate([
//     {
//       $match: {
//         isPending: false,
//         isEnabled: true,
//         isConfirmed: true,
//         $or: [
//           { 'emailVerification.isVerified': true },
//           { 'phoneVerification.isVerified': true },
//         ],
//       },
//     },
//     // {
//     //   $unwind: `$paymentMethods.${paymentMethod}`,
//     // },
//     {
//       $match: {
//         [`paymentMethods.${paymentMethod}.enable`]: false,
//       },
//     },
//     {
//       $project: {
//         name: 1,
//         [`paymentMethods.${paymentMethod}`]: 1,
//       },
//     },
//   ]).exec();
//   return charity;
// };
export const adminRepository = {
  findAllPendingCharities,
  //   findConfirmedCharityById,
  //   getPendingPaymentAccountByAggregation,
  //   findCharitiesByQueryWithOptionalId,
};
