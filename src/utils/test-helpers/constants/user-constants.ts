import { getDummyUserObject } from '..';

export const DUMMY_USER = getDummyUserObject();

export const EDIT_USER_PROFILE_DATA = {
  name: {
    firstName: 'dummy',
    lastName: 'dummy',
  },
  email: 'dummy@dummy.ape',
  phone: '01098765432',
  gender: 'male',
  userLocation: {
    governorate: 'Aswan',
  },
};
