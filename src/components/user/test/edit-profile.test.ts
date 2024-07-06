import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals';
import {
  DUMMY_USER,
  EDIT_USER_PROFILE_DATA,
  NEW_EMAIL,
  authenticatedUserTestingEnvironment,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

import UserModel from '../data-access/models/user.model';

let axiosAPIClient: AxiosInstance;

const env = authenticatedUserTestingEnvironment;

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

afterEach(async () => {
  await env.teardown();
  ({ axiosAPIClient } = await env.setup());
});

afterAll(async () => {
  await env.teardown();
});

describe('/api/users', () => {
  describe('PUT /profile/edit', () => {
    test('Should edit profile with 200 status code', async () => {
      //Arrange
      const user = {
        name: EDIT_USER_PROFILE_DATA.name,
        phone: EDIT_USER_PROFILE_DATA.phone,
        gender: EDIT_USER_PROFILE_DATA.gender,
        userLocation: {
          governorate: EDIT_USER_PROFILE_DATA.userLocation.governorate,
        },
      };

      //Act
      const response = await axiosAPIClient.put('/api/users/profile/edit', user);

      //Assert
      expect(response.status).toBe(200);
      expect(response.data.user.phone).toBe(user.phone);
    });
    test('Should Throw Bad request error when trying to edit values that are not allowed e.g. isAdmin', async () => {
      //Arrange
      const user = {
        isAdmin: true,
      };

      //Act
      const response = await axiosAPIClient.put('/api/users/profile/edit', user);

      //Assert
      expect(response.status).toBe(400);
    });

    test('Should Throw Bad request error when trying to use an email that is already registered', async () => {
      //Arrange
      //Seed the DB
      await UserModel.create({ ...DUMMY_USER, email: NEW_EMAIL });
      const user = {
        email: NEW_EMAIL,
      };

      //Act
      const response = await axiosAPIClient.put('/api/users/profile/edit', user);

      //Assert
      expect(response.status).toBe(400);
    });

    test('When the email is changed, the old email should not be in the database & and Account needs to be verified again', async () => {
      // Arrange
      const userData = {
        email: EDIT_USER_PROFILE_DATA.email,
      };

      // Act
      const editProfileResponse = await axiosAPIClient.put('/api/users/profile/edit', userData);

      const getProfileResponse = await axiosAPIClient.get('/api/users/profile');

      // Assert
      expect(editProfileResponse.status).toBe(200);
      expect(getProfileResponse.data.user.email).toBe(userData.email);
      expect(getProfileResponse.data.user.emailVerification.isVerified).toBe(false);
      expect(getProfileResponse.data.user.verificationCode).not.toBe('');
    });
  });
});
