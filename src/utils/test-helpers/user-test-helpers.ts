import { PlainUser } from '@components/user/data-access/interfaces';
import UserModel from '@components/user/data-access/models/user.model';
import { userRepository as UserRepository } from '@components/user/data-access/user.repository';
import { generateTokenForTesting } from '@utils/generateToken';

export const createDummyUserAndReturnToken = async () => {
  const userRepository = new UserRepository();

  const dummyUserData: PlainUser = {
    name: {
      firstName: 'dummy',
      lastName: 'dummy',
    },
    email: 'dummy@dummy.com',
    password: 'dummy',
    phone: '01234567890',
    gender: 'male',
    userLocation: {
      governorate: 'Cairo',
    },
    isAdmin: false,
    contributions: [],
    isEnabled: true,
    pointsOnDonations: 0,
    totalDonationsAmount: 0,
    transactions: [],
    verificationCode: 'dummy',
    emailVerification: {
      isVerified: true,
      verificationDate: new Date().toString(),
    },
  };

  const dummyUser = await userRepository.createUser(dummyUserData);

  const token = generateTokenForTesting(dummyUser._id.toString(), 'user');

  return token;
};

export const clearUserDatabase = async () => {
  await UserModel.deleteMany({});
};
