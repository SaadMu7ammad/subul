import { PlainUser } from '@components/user/data-access/interfaces';
import UserModel from '@components/user/data-access/models/user.model';
import { USER } from '@components/user/domain/user.class';
import { generateTokenForTesting } from '@utils/generateToken';

export const createDummyUserAndReturnToken = async () => {
  const user = new USER();

  const dummyUserData: PlainUser = getDummyUserObject(true, true);

  const dummyUser = await user.userModel.createUser(dummyUserData);

  const token = generateTokenForTesting(dummyUser._id.toString(), 'user');

  return token;
};

export const clearUserDatabase = async () => {
  await UserModel.deleteMany({});
};

export const getDummyUserObject = (
  isEnabled: boolean = false,
  isVerified: boolean = false
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
    totalDonationsCount: 0,
    transactions: [],
    verificationCode: 'dummy',
    emailVerification: {
      isVerified,
      verificationDate: new Date().toString(),
    },
  };
};
