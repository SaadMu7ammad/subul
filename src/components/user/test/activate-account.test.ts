import { USER } from '@components/user/domain/user.class';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  DUMMY_TOKEN,
  DUMMY_USER,
  INVALID_TOKEN,
  UserTestingEnvironment,
  deactivateUserAccount,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const userObject = new USER();

const env = new UserTestingEnvironment(
  { usedDbs: ['user'], authenticated: true },
  { verificationCode: DUMMY_TOKEN, isEnabled: true, isVerified: false }
);

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

beforeEach(async () => {
  await deactivateUserAccount(DUMMY_USER.email);
});

afterAll(async () => {
  await env.teardown();
});

describe('/api/users', () => {
  describe('POST /activate', () => {
    test('Should Activate Account and delete verificationCode from DB with 200 Status Code', async () => {
      // Act
      const response = await axiosAPIClient.post('/api/users/activate', {
        token: DUMMY_TOKEN,
      });

      const user = await userObject.userModel.findUser(DUMMY_USER.email);

      // Assert
      expect(response.status).toBe(200);
      expect(user?.emailVerification?.isVerified).toBe(true);
      expect(user?.verificationCode).toBe('');
    });

    test('Should return 401 if the token is invalid', async () => {
      // Act
      const response = await axiosAPIClient.post('/api/users/activate', {
        token: INVALID_TOKEN,
      });

      // Assert
      expect(response.status).toBe(401);
    });

    test('Should return 400 if the account is already activated', async () => {
      // Arrange
      await axiosAPIClient.post('/api/users/activate', {
        token: DUMMY_TOKEN,
      });

      // Act
      const response = await axiosAPIClient.post('/api/users/activate', {
        token: DUMMY_TOKEN,
      });

      console.log(response);

      // Assert
      expect(response.status).toBe(400);
    });
  });
});
