import { PlainUser } from '@components/user/data-access/interfaces';
import UserModel from '@components/user/data-access/models/user.model';
import { USER } from '@components/user/domain/user.class';
import { generateTokenForTesting } from '@utils/generateToken';

import { DUMMY_TOKEN } from '..';

export const createDummyUserAndReturnToken = async (
  isEnabled: boolean = true,
  isVerified: boolean = true,
  verificationCode: string = 'dummy'
) => {
  const user = new USER();

  const dummyUserData: PlainUser = getDummyUserObject(isEnabled, isVerified, verificationCode);

  const dummyUser = await user.userModel.createUser(dummyUserData);

  const token = generateTokenForTesting(dummyUser._id.toString(), 'user');

  return token;
};

export const clearUserDatabase = async () => {
  await UserModel.deleteMany({});
};

export const getDummyUserObject = (
  isEnabled: boolean = true,
  isVerified: boolean = true,
  verificationCode: string = 'dummy'
): PlainUser => {
  return {
    name: {
      firstName: 'folan',
      lastName: '3ellan',
    },
    email: 'folan@3ellan.teltan',
    password: 'folan3ellanTelTan',
    phone: '01012345678',
    gender: 'male',
    userLocation: {
      governorate: 'Giza',
    },
    isAdmin: false,
    contributions: [],
    isEnabled,
    pointsOnDonations: 0,
    totalDonationsAmount: 0,
    transactions: [],
    verificationCode,
    emailVerification: {
      isVerified,
      verificationDate: new Date().toString(),
    },
  };
};

export const deactivateUserAccount = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (user && user.emailVerification && user.verificationCode !== undefined) {
    user.emailVerification.isVerified = false;

    user.emailVerification.verificationDate = '';

    user.verificationCode = DUMMY_TOKEN;

    await user.save();
  }
};
