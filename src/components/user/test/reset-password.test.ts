import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import {
  DUMMY_USER,
  NON_EXISTING_EMAIL,
  unauthenticatedUserTestingEnvironment,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

import { USER } from '../domain/user.class';

const userObj = new USER();

let axiosAPIClient: AxiosInstance;

const env = unauthenticatedUserTestingEnvironment;

beforeAll(async () => {
  const { axiosAPIClient: client } = await env.setup();
  axiosAPIClient = client;
});

afterAll(async () => {
  await env.teardown();
});

describe('/api/users', () => {
  describe('POST /reset', () => {
    test('Should send reset Email & Verification Code should be stored in the db with 200 status code ', async () => {
      //Act
      const resetPasswordResponse = await axiosAPIClient.post('/api/users/reset', {
        email: DUMMY_USER.email,
      });

      const user = await userObj.userModel.findUser(DUMMY_USER.email);

      //Assert
      expect(resetPasswordResponse.status).toBe(200);
      expect(user?.verificationCode).toBeDefined();
      expect(user?.verificationCode.length).toBe(60);
    });
    test('Should throw an error when email is not stored in the DB with 404 status code', async () => {
      //Act
      const resetPasswordResponse = await axiosAPIClient.post('/api/users/reset', {
        email: NON_EXISTING_EMAIL,
      });

      //Assert
      expect(resetPasswordResponse.status).toBe(404);
    });
  });
});
