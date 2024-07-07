import { NON_EXISTING_ID } from '..';

export const DUMMY_CASE = {
  charityName: 'dummyCharity',
  charity: NON_EXISTING_ID,
  title: 'dummyTitle',
  description: 'dummyDescription',
  mainType: 'BloodDonation',
  subType: 'BloodDonation',
  coverImage: 'dummyImage.png',
  caseLocation: [
    {
      governorate: 'Giza',
    },
  ],
  gender: 'male',
  privateNumber: '01012345678',
  helpedNumbers: 1,
  targetDonationAmount: 1,
};
