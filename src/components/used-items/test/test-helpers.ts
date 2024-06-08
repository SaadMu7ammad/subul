import { PlainUser } from '@components/user/data-access/interfaces';
import { userRepository as UserRepository } from '@components/user/data-access/user.repository';
import connectDB from '@config/db';
import { generateTokenForTesting } from '@utils/generateToken';

(async () => await connectDB())();

/*
1. make a test DB
    put the url in the config file and use the .env to determine which Url to be used (test | dev | prod)
    >> OFC jest sets the .env environment to 'test'
    OR
    create it here ?
    >> We should use the a local mongo db , Edit : for simplicity we can use a cloud DB
2. create a dummy verified user
3. return the token of the dummy user
*/
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
