import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { NEW_PASSWORD, authenticatedUserTestingEnvironment } from '@utils/test-helpers';
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
  describe('PUT /changepassword', () => {
    test('should change password successfully with 200 status code', async () => {
      //Act
      const response = await axiosAPIClient.put('/api/users/changepassword', {
        password: NEW_PASSWORD,
      });

      //Assert
      expect(response.status).toBe(200);
    });
  });
});
