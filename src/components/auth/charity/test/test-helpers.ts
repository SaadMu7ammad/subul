import { CharityRepository } from '@components/charity/data-access/charity.repository';
import { PlainCharity } from '@components/charity/data-access/interfaces';
import { Charity as CharityModel } from '@components/charity/data-access/models/charity.model';
import { generateTokenForTesting } from '@utils/generateToken';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export const createDummyCharityAndReturnToken = async () => {
  const charityRepository = new CharityRepository();

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
      establishedDate: '2021-01-01',
      registeredNumber: '1234567890',
    },
  };

  const dummyCharity = await charityRepository.createCharity(dummyCharityData);

  const token = generateTokenForTesting(dummyCharity!._id.toString(), 'charity');

  return token;
};

export const clearCharityDatabase = async () => {
  await CharityModel.deleteMany({});
};

export const appendDummyImageToFormData = (formData: FormData) => {
  const imagePath = path.resolve(__dirname, 'test-image.png');
  const imageBuffer = fs.readFileSync(imagePath);
  formData.append('image', imageBuffer, 'test-image.png');
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

export const appendDummyCharityToFormData = (formData: FormData) => {
  const dummyCharity = getDummyCharityObject();

  const appendToFormData = (key: string, value: any) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.keys(value).forEach(nestedKey => {
        appendToFormData(`${key}[${nestedKey}]`, value[nestedKey]);
      });
    } else {
      formData.append(key, Array.isArray(value) ? value[0] : value.toString());
    }
  };

  Object.keys(dummyCharity).forEach(key => {
    appendToFormData(key, dummyCharity[key as keyof PlainCharity]);
  });
};
