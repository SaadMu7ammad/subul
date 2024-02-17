import Charity from '../../charity/data-access/models/charity.model.js';

const findAllPendingCharities = async (queryObject, selection) => {
  const pendingcharities = await Charity.find(queryObject, selection).exec();
  // .select('name email charityDocs paymentMethods')
  return pendingcharities;
};
const findCharitiesByQueryWithOptionalId = async (queryObject, selection) => {
  const pendingcharities = await Charity.find(queryObject, selection).exec();
  return pendingcharities;
};
const findConfirmedCharityById = async (queryObject, selection) => {
  const charity = await Charity.findOne(queryObject, selection).select('-_id'); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}
  return charity;
};
const getPendingPaymentAccountByAggregation = async (paymentMethod) => {
  const charity = await Charity.aggregate([
    {
      $match: {
        isPending: false,
        isEnabled: true,
        isConfirmed: true,
        $or: [
          { 'emailVerification.isVerified': true },
          { 'phoneVerification.isVerified': true },
        ],
      },
    },
    // {
    //   $unwind: `$paymentMethods.${paymentMethod}`,
    // },
    {
      $match: {
        [`paymentMethods.${paymentMethod}.enable`]: false,
      },
    },
    {
      $project: {
        name: 1,
        [`paymentMethods.${paymentMethod}`]: 1,
      },
    },
  ]).exec();
  return charity;
};
export const adminRepository = {
  findAllPendingCharities,
  findConfirmedCharityById,
  getPendingPaymentAccountByAggregation,
  findCharitiesByQueryWithOptionalId,
};
