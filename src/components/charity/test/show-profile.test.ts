import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { CharityTestingEnvironment } from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = new CharityTestingEnvironment({ authenticated: true, usedDbs: ['charity'] });

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

afterAll(async () => {
  await env.teardown();
});

describe('api/charities', () => {
  describe('GET /profile', () => {
    test('should return the charity profile with 200 status code', async () => {
      //Act
      const response = await axiosAPIClient.get('/api/charities/profile');
      //Assert
      expect(response.status).toBe(200);
      expect(response.data.charity.email).toBe('dummy@dummy.ape');
    });
  });
});
