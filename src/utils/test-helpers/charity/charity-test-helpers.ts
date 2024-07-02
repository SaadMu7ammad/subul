import { PlainCharity } from '@components/charity/data-access/interfaces';
import { Charity as CharityModel } from '@components/charity/data-access/models/charity.model';
import { CHARITY } from '@components/charity/domain/charity.class';
import { generateTokenForTesting } from '@utils/generateToken';
import FormData from 'form-data';

import { appendDummyImageToFormData } from '..';

const charityObj = new CHARITY();

export const clearCharityDatabase = async () => {
  await CharityModel.deleteMany({});
};

export const appendDocsToFormData = (formData: FormData) => {
  for (let i = 1; i <= 4; i++) {
    appendDummyImageToFormData(formData, `charityDocs${i}`);
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

export const getDummyCharityObject = (
  isActivated: boolean = true,
  isConfirmed: boolean = true,
  verificationCode: string = ''
): PlainCharity => {
  return {
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
    password: 'dummyPassword',
    name: 'dummy',
    phone: '01234567890',
    contactInfo: {
      email: 'dummy@dummy.ape',
      phone: '01234567890',
      websiteUrl: 'dummy.ape',
    },
    description: 'dummyDescription',
    emailVerification: {
      isVerified: isActivated,
      verificationDate: isActivated ? new Date().toString() : '',
    },
    isEnabled: true,
    isConfirmed,
    isPending: false,
    currency: ['EGP'],
    charityLocation: {
      //@ts-expect-error don't care much when we are testing :P
      governorate: 'Cairo',
    },
    verificationCode,
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
};

export const createDummyCharityAndReturnToken = async (
  isActivated: boolean = true,
  isConfirmed: boolean = true,
  verificationCode: string = ''
) => {
  const charityRepository = charityObj.charityModel;

  const dummyCharityData: PlainCharity = getDummyCharityObject(
    isActivated,
    isConfirmed,
    verificationCode
  );

  const dummyCharity = await charityRepository.createCharity(dummyCharityData);

  const token = generateTokenForTesting(dummyCharity!._id.toString(), 'charity');

  return token;
};

export const appendDummyCharityToFormData = (formData: FormData) => {
  const dummyCharity = getDummyCharityObject();

  const appendToFormData = (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          appendToFormData(`${key}[${index}]`, item);
        });
      } else {
        Object.keys(value).forEach(nestedKey => {
          appendToFormData(`${key}[${nestedKey}]`, value[nestedKey]);
        });
      }
    } else {
      formData.append(key, value.toString());
    }
  };

  Object.keys(dummyCharity).forEach(key => {
    appendToFormData(key, dummyCharity[key as keyof PlainCharity]);
  });
};
