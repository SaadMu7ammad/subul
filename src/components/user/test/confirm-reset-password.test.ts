import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import {
  DUMMY_USER,
  NEW_PASSWORD,
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
  });
});

/*
 * Senarios:
 * 1. if email doesn't exits
 * 2. if there is no verification code
 * 3. if token is invalid
 * 4. In the happy senario : the password should be updated and the verification code should be removed
 *
 */
