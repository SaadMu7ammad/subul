import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { authenticatedUserTestingEnvironment } from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = authenticatedUserTestingEnvironment;

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

afterAll(async () => {
  await env.teardown();
});

describe('api/users', () => {
  describe('POST /logout', () => {
    test('should logout the user and delete the cookie with 200 status code', async () => {
      //Act
      const response = await axiosAPIClient.post('/api/users/logout');

      //Simulating browser behavior
      if (response.headers['set-cookie'] && response.headers['set-cookie'][0])
        axiosAPIClient.defaults.headers['cookie'] = response.headers['set-cookie'][0];

      //Assert
      expect(response.status).toBe(200);
      if (response.headers['set-cookie'])
        expect(response.headers['set-cookie'][0]).toMatch(/jwt=;/);
    });
  });
});
