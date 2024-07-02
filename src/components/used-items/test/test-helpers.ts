import { PlainCharity } from '@components/charity/data-access/interfaces';
import { Charity as CharityModel } from '@components/charity/data-access/models/charity.model';
import { CHARITY } from '@components/charity/domain/charity.class';
import { PlainUser } from '@components/user/data-access/interfaces';
import UserModel from '@components/user/data-access/models/user.model';
import { USER } from '@components/user/domain/user.class';
import { generateTokenForTesting } from '@utils/generateToken';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

import UsedItem from '../data-access/models/used-item.model';

export const createDummyUserAndReturnToken = async () => {
  const user = new USER();
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

  const dummyUser = await user.userModel.createUser(dummyUserData);

  const token = generateTokenForTesting(dummyUser._id.toString(), 'user');

  return token;
};

export const createDummyCharityAndReturnToken = async () => {
  const charity = new CHARITY();

  const dummyCharityData: PlainCharity = {
    cases: [],
    image: 'image.png',
    email: 'dummy@dummy.ape',
    password: 'dummy',
    name: 'dummy',
    contactInfo: {
      email: 'dummy@dummy.ape',
      phone: '1234567890',
      websiteUrl: 'dummy.ape',
    },
    description: 'dummy',
    emailVerification: {
      isVerified: true,
      verificationDate: new Date().toString(),
    },
    isEnabled: true,
    isConfirmed: true,
    isPending: false,
    currency: ['EGP'],
    charityLocation: [
      //@ts-expect-error don't care much when we are testing :P
      {
        governorate: 'Cairo',
      },
    ],
    charityDocs: {
      docs1: ['doc1.png'],
      docs2: ['doc2.png'],
      docs3: ['doc3.png'],
      docs4: ['doc4.png'],
    },
    charityInfo: {
      establishedDate: new Date().toString(),
      registeredNumber: '1234567890',
    },
  };

  const dummyCharity = await charity.charityModel.createCharity(dummyCharityData);

  const token = generateTokenForTesting(dummyCharity!._id.toString(), 'charity');

  return token;
};

export const clearUserDatabase = async () => {
  await UserModel.deleteMany({});
};

export const clearUsedItemsDatabase = async () => {
  await UsedItem.deleteMany({});
};

export const clearCharityDatabase = async () => {
  await CharityModel.deleteMany({});
};

export const appendDummyImagesToFormData = (formData: FormData) => {
  const imagePath = path.resolve(__dirname, 'test-image.png');
  const imageBuffer = fs.readFileSync(imagePath);
  for (let i = 1; i <= 5; i++) {
    formData.append('images', imageBuffer, `test-image${i}.png`);
  }
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
