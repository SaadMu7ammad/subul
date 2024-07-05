import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { EDIT_USER_PROFILE_DATA, authenticatedUserTestingEnvironment } from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = authenticatedUserTestingEnvironment;

beforeAll(async () => {
  const { axiosAPIClient: client } = await env.setup();
  axiosAPIClient = client;
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

      const response = await axiosAPIClient.put('/api/users/profile/edit', user);

      expect(response.status).toBe(200);
      expect(response.data.user.phone).toBe(user.phone);
    });
  });
});

// check if the email is already taken.
