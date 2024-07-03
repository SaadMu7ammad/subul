import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { authenticatedCharityTestingEnvironment } from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = authenticatedCharityTestingEnvironment;

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

afterAll(async () => {
  await env.teardown();
});

describe('api/charities', () => {
  describe('POST /logout', () => {
    test('should logout the charity and delete the cookie with 200 status code', async () => {
      //Act
      const response = await axiosAPIClient.post('/api/charities/logout');

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
