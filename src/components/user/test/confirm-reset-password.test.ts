import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import {
  DUMMY_TOKEN,
  DUMMY_USER,
  INVALID_TOKEN,
  NEW_PASSWORD,
  NON_EXISTING_EMAIL,
  unauthenticatedUserTestingEnvironment,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import bcryptjs from 'bcryptjs';

import { USER } from '../domain/user.class';

let axiosAPIClient: AxiosInstance;

const env = unauthenticatedUserTestingEnvironment;

const userObj = new USER();

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

afterAll(async () => {
  await env.teardown();
});

describe('/api/users', () => {
  describe('POST /reset/confirm', () => {
    test('Should return 401 if the verificationCode is invalid', async () => {
      // Arrange
      await axiosAPIClient.post('/api/users/reset', {
        email: DUMMY_USER.email,
      });

      // Act
      const confirmResetResponse = await axiosAPIClient.post('/api/users/reset/confirm', {
        email: DUMMY_USER.email,
        token: INVALID_TOKEN,
        password: NEW_PASSWORD,
      });

      // Assert
      expect(confirmResetResponse.status).toBe(401);
    });

    test('Should change the password and remove verification code with 200 status code', async () => {
      // Arrange
      await axiosAPIClient.post('/api/users/reset', {
        email: DUMMY_USER.email,
      });

      const userBeforeChangingPassword = await userObj.userModel.findUser(DUMMY_USER.email);

      // Act
      const confirmResetResponse = await axiosAPIClient.post('/api/users/reset/confirm', {
        email: DUMMY_USER.email,
        token: userBeforeChangingPassword?.verificationCode,
        password: NEW_PASSWORD,
      });

      const userAfterChangingPassword = await userObj.userModel.findUser(DUMMY_USER.email);

      // Assert
      expect(confirmResetResponse.status).toBe(200);
      expect(userAfterChangingPassword?.verificationCode).toBe('');
      let isMatch = false;
      if (userAfterChangingPassword && userAfterChangingPassword.password) {
        isMatch = await bcryptjs.compare(NEW_PASSWORD, userAfterChangingPassword.password);
      }
      expect(isMatch).toBe(true);
    });

    test('Should return 404 status code if email does not exist', async () => {
      // Act
      const confirmResetResponse = await axiosAPIClient.post('/api/users/reset/confirm', {
        email: NON_EXISTING_EMAIL,
        token: DUMMY_TOKEN,
        password: NEW_PASSWORD,
      });

      // Assert
      expect(confirmResetResponse.status).toBe(404);
    });

    test('Should return 404 status code if there is no verificationCode stored in the DB', async () => {
      // Previous tests should have already removed the verification code
      // Act
      const confirmResetResponse = await axiosAPIClient.post('/api/users/reset/confirm', {
        email: DUMMY_USER.email,
        token: INVALID_TOKEN,
        password: NEW_PASSWORD,
      });

      // Assert
      expect(confirmResetResponse.status).toBe(404);
    });
  });
});
