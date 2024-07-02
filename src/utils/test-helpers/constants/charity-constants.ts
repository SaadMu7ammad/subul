import { getDummyCharityObject } from '..';

export const DUMMY_CHARITY = getDummyCharityObject();
export const DUMMY_TOKEN = '60CharToken60CharToken60CharToken60CharToken60CharToken60Cha';
export const INVALID_TOKEN = 'invalidTokeninvalidTokeninvalidTokeninvalidTokeninvalidToken';
export const NEW_PASSWORD = 'newPassword';
export const EDIT_CHARITY_PROFILE_DATA = {
  name: 'Charity Name',
  email: 'dummy@dummy.dummy',
  location: {
    governorate: 'Cairo',
    city: 'apeCity',
  },
  description: 'this is a description',
};
export const BANK_ACCOUNT_INFO = {
  accNumber: '1503070704120700019',
  swiftCode: 'ECBAEGCA',
  iban: 'EG890003000930603696309000540',
};
export const NON_EXISTING_CHARITY_EMAIL = 'none@none.ape';
export const INVALID_PASSWORD = 'invalidPassword';
