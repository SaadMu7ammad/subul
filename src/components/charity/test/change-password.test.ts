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
  describe('POST /change-password', () => {
    test('should change password successfully with 200 status code', async () => {
      const response = await axiosAPIClient.post('/api/charities/change-password', {
        password: 'newPassword',
      });

      expect(response.status).toBe(200);
    });
  });
});
