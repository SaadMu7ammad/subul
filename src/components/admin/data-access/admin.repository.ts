import { QueryObject } from '@components/admin/domain/admin.service';
import {
  AllCharities,
  CharitiesAccountsByAggregation,
  DataForForConfirmedCharity,
  PendingCharities,
} from '@components/charity/data-access/interfaces';
import CharityModel from '@components/charity/data-access/models/charity.model';
import UserModel from '@components/user/data-access/models/user.model';

const findAllCharities = async (selection: string): Promise<AllCharities[]> => {
  const charities = await CharityModel.find().select(selection).lean(); // Use .lean() to get plain JavaScript objects instead of Mongoose documents

  return charities;
};

const findAllUsers = async (selection: string) => {
  const users = await UserModel.find().select(selection);
  return users;
};

const findCharityById = async (id: string) => {
  const charity = await CharityModel.findById(id);
  return charity;
};

const findAllPendingCharities = async (
  queryObject: QueryObject,
  selection: string
): Promise<PendingCharities[]> => {
  const pendingCharities: PendingCharities[] = await CharityModel.find(
    queryObject,
    selection
  ).exec();

  // .select('name email charityDocs paymentMethods')
  return pendingCharities;
};

const findCharitiesByQueryWithOptionalId = async (
  queryObject: QueryObject,
  selection: string
): Promise<PendingCharities[]> => {
  // select => name email paymentMethods
  const pendingCharities: PendingCharities[] = await CharityModel.find(
    queryObject,
    selection
  ).exec();
  return pendingCharities; // [ { name email paymentMethods _id } ]
};

const findConfirmedCharityById = async (queryObject: QueryObject, selection: string) => {
  const charity: DataForForConfirmedCharity = await CharityModel.findOne(
    queryObject,
    selection
  ).select('-_id'); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}

  return charity;
};

const getPendingPaymentAccountByAggregation = async (paymentMethod: string) => {
  const charity: CharitiesAccountsByAggregation[] = await CharityModel.aggregate([
    {
      $match: {
        isPending: false,
        isEnabled: true,
        isConfirmed: true,
        $or: [{ 'emailVerification.isVerified': true }, { 'phoneVerification.isVerified': true }],
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
  // console.log(charity); // [ { _id, name, paymentMethods: { bankAccount: [Array] } } ] [ { } ]...
  return charity;
};

const deleteUserByEmail = async (email: string): Promise<boolean> => {
  const user = await UserModel.deleteOne({ email });
  return user.acknowledged;
};

const deleteCharityByEmail = async (email: string): Promise<boolean> => {
  const charity = await CharityModel.deleteOne({ email });
  return charity.acknowledged;
};

export const adminRepository = {
  findAllCharities,
  findAllUsers,
  findCharityById,
  findAllPendingCharities,
  findConfirmedCharityById,
  getPendingPaymentAccountByAggregation,
  findCharitiesByQueryWithOptionalId,
  deleteUserByEmail,
  deleteCharityByEmail,
};
