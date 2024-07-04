import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  CharityTestingEnvironment,
  DUMMY_CHARITY,
  DUMMY_TOKEN,
  INVALID_TOKEN,
  deactivateCharityAccount,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

import Charity from '../data-access/models/charity.model';

let axiosAPIClient: AxiosInstance;

const env = new CharityTestingEnvironment(
  { authenticated: true, usedDbs: ['charity'] },
  {
    isActivated: true,
    isConfirmed: false,
    verificationCode: DUMMY_TOKEN,
  }
);

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

beforeEach(async () => {
  await deactivateCharityAccount(DUMMY_CHARITY.email);
});

afterAll(async () => {
  await env.teardown();
});

describe('api/charities', () => {
  describe('POST /activate', () => {
    test('Should Activate Account and delete verificationCode from DB with 200 Status Code', async () => {
      // Act
      const response = await axiosAPIClient.post('/api/charities/activate', {
        token: '60CharToken60CharToken60CharToken60CharToken60CharToken60Cha',
      });

      // Assert
      const charity = await Charity.findOne({ email: 'dummy@dummy.ape' });

      expect(response.status).toBe(200);
      expect(charity?.emailVerification?.isVerified).toBe(true);
      expect(charity?.verificationCode).toBe('');
    });

    test('Should return 401 Status Code if token is invalid', async () => {
      // Act
      const response = await axiosAPIClient.post('/api/charities/activate', {
        token: INVALID_TOKEN,
      });

      // Assert
      expect(response.status).toBe(401);
    });

    test('Should return 400 Status Code if account is already activated', async () => {
      // Arrange
      await axiosAPIClient.post('/api/charities/activate', {
        token: DUMMY_TOKEN,
      });

      // Act
      const response = await axiosAPIClient.post('/api/charities/activate', {
        token: DUMMY_TOKEN,
      });

      // Assert
      expect(response.status).toBe(400);
    });
  });
});
