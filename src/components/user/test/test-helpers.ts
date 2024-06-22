import { PlainUser } from '@components/user/data-access/interfaces';
import UserModel from '@components/user/data-access/models/user.model';
import { userRepository as UserRepository } from '@components/user/data-access/user.repository';
import { generateTokenForTesting } from '@utils/generateToken';
import axios from 'axios';

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

export const createAxiosApiClient = (token: string, port: number) => {
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
    headers: {
      cookie: `jwt=${token}`,
    },
  };
  return axios.create(axiosConfig);
};
