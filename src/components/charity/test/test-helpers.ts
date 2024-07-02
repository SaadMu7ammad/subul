import { PlainCharity } from '@components/charity/data-access/interfaces';
import { Charity as CharityModel } from '@components/charity/data-access/models/charity.model';
import { generateTokenForTesting } from '@utils/generateToken';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

import { CHARITY } from '../domain/charity.class';

export const createDummyCharityAndReturnToken = async (
  isActivated: boolean = true,
  isConfirmed: boolean = true,
  verificationCode: string = ''
) => {
  const charity = new CHARITY();

  const dummyCharityData: PlainCharity = {
    paymentMethods: {
      bankAccount: [
        {
          accNumber: '1234567890',
          swiftCode: '1234567890',
          iban: '1234567890',
          bankDocs: ['doc.png'],
          enabled: true,
          //@ts-expect-error don't care much when we are testing :P
          _id: '65f9fcf93dbbeaaa8c2afec4',
        },
      ],
    },
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
      isVerified: isActivated,
      verificationDate: isActivated ? new Date().toString() : '',
    },
    isEnabled: true,
    isConfirmed,
    isPending: false,
    currency: ['EGP'],
    charityLocation: [
      //@ts-expect-error don't care much when we are testing :P
      {
        governorate: 'Cairo',
      },
    ],
    verificationCode,
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

  const dummyCharity = await charity.chairtyModel.createCharity(dummyCharityData);

  const token = generateTokenForTesting(dummyCharity!._id.toString(), 'charity');

  return token;
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

export const getDummyCharityObject = (): PlainCharity => {
  return {
    image: 'image.png',
    email: 'dummy@dummy.ape',
    password: 'dummyPassword',
    name: 'dummy',
    contactInfo: {
      email: 'dummy@dummy.ape',
      phone: '01012345678',
      websiteUrl: 'dummy.ape',
    },
    description: 'dummyDescription',
    emailVerification: {
      isVerified: false,
      verificationDate: '',
    },
    isEnabled: false,
    isConfirmed: false,
    isPending: false,
    currency: ['EGP'],
    charityLocation: {
      // @ts-expect-error don't care much when we are testing :P
      governorate: 'Cairo',
    },
    charityInfo: {
      establishedDate: '2021-01-01',
      registeredNumber: '1234567890',
    },
  };
};

export const appendDummyImageToFormData = (formData: FormData, imageName: string) => {
  const imagePath = path.resolve(__dirname, 'test-image.png');
  const imageBuffer = fs.readFileSync(imagePath);
  formData.append(imageName, imageBuffer, 'test-image.png');
};

export const appendDocsToFormData = (formData: FormData) => {
  const imagePath = path.resolve(__dirname, 'test-image.png');
  const imageBuffer = fs.readFileSync(imagePath);
  for (let i = 1; i <= 4; i++) {
    formData.append(`charityDocs${i}`, imageBuffer, `test-image${i}.png`);
  }
};

export const appendBankInfoToFormData = (formData: FormData) => {
  const bankInfo = {
    accNumber: '1503070704120700019',
    swiftCode: 'ECBAEGCA',
    iban: 'EG890003000930603696309000540',
  };

  for (const [key, value] of Object.entries(bankInfo)) {
    formData.append(key, value);
  }

  appendDummyImageToFormData(formData, 'bankDocs');
};
