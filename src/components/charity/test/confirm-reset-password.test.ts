import Charity from '@components/charity/data-access/models/charity.model';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  CharityTestingEnvironment,
  clearCharityDatabase,
  getDummyCharityObject,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = new CharityTestingEnvironment({ authenticated: false, usedDbs: ['charity'] });

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

beforeEach(async () => {
  await clearCharityDatabase();
});

afterAll(async () => {
  await env.teardown();
});

describe('/api/charities', () => {
  describe('POST /reset/confirm', () => {
    test('Should confirm reset password request & password should be changed with 200 status code', async () => {
      //Arrange
      const charity = getDummyCharityObject();
      await Charity.create(charity);

      //Act
      await axiosAPIClient.post('/api/charities/reset', {
        email: charity.email,
      });

      const fetchedCharity = await Charity.findOne({ email: charity.email });

      const confirmResetPasswordResponse = await axiosAPIClient.post(
        '/api/charities/reset/confirm',
        {
          email: charity.email,
          token: fetchedCharity?.verificationCode,
          password: 'newPassword',
        }
      );

      const charityAuthResponse = await axiosAPIClient.post('/api/charities/auth', {
        email: charity.email,
        password: 'newPassword',
      });

      //Assert
      expect(confirmResetPasswordResponse.status).toBe(200);
      expect(charityAuthResponse.status).toBe(200);
    });

    test('Should return 401 status code if token is invalid', async () => {
      //Arrange
      const charity = getDummyCharityObject();
      await Charity.create(charity);

      //Act
      await axiosAPIClient.post('/api/charities/reset', {
        email: charity.email,
      });

      const confirmResetPasswordResponse = await axiosAPIClient.post(
        '/api/charities/reset/confirm',
        {
          email: charity.email,
          token: '60CharToken60CharToken60CharToken60CharToken60CharToken60Cha',
          password: 'newPassword',
        }
      );

      //Assert
      expect(confirmResetPasswordResponse.status).toBe(401);
    });
  });
});
