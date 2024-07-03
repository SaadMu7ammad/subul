import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { DUMMY_USER, authenticatedUserTestingEnvironment } from '@utils/test-helpers';
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
  describe('GET /profile', () => {
    test('Should return profile data with 200 status code', async () => {
      //Act
      const response = await axiosAPIClient.get('/api/users/profile');

      //Assert
      expect(response.status).toBe(200);
      expect(response.data.user.email).toBe(DUMMY_USER.email);
    });
  });
});
