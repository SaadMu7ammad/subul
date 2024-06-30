import {
  AllCharities,
  CharitiesAccountsByAggregation,
  DataForForConfirmedCharity,
  PendingCharities,
} from '@components/charity/data-access/interfaces';
import CharityModel from '@components/charity/data-access/models/charity.model';
import UserModel from '@components/user/data-access/models/user.model';
import { USER } from '@components/user/domain/user.class';

import { QueryObject } from '../data-access/interfaces/admin.interface';

class adminRepository {
  async findAllCharities(selection: string): Promise<AllCharities[]> {
    const charities = await CharityModel.find().select(selection);
    return charities;
  }

  async findAllPendingCharities(
    queryObject: QueryObject,
    selection: string
  ): Promise<PendingCharities[]> {
    const pendingCharities: PendingCharities[] = await CharityModel.find(
      queryObject,
      selection
    ).exec();

    // .select('name email charityDocs paymentMethods')
    return pendingCharities;
  }

  async findCharitiesByQueryWithOptionalId(
    queryObject: QueryObject,
    selection: string
  ): Promise<PendingCharities[]> {
    // select => name email paymentMethods
    const pendingCharities: PendingCharities[] = await CharityModel.find(
      queryObject,
      selection
    ).exec();
    return pendingCharities; // [ { name email paymentMethods _id } ]
  }

  async findConfirmedCharityById(queryObject: QueryObject, selection: string) {
    const charity: DataForForConfirmedCharity = await CharityModel.findOne(
      queryObject,
      selection
    ).select('-_id'); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}

    return charity;
  }

  async getPendingPaymentAccountByAggregation(paymentMethod: string) {
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
  }

  async deleteUserByEmail(email: string): Promise<boolean> {
    const user = await UserModel.deleteOne({ email });
    return user.acknowledged;
  }

  async deleteCharityByEmail(email: string): Promise<boolean> {
    const charity = await CharityModel.deleteOne({ email });
    return charity.acknowledged;
  }
}

export class ADMIN {
  public userModel = new USER();
  public adminModel = new adminRepository();

  constructor() {
    // super();
  }
}
