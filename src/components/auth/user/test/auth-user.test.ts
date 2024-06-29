import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  authenticatedUserTestingEnvironment,
  clearUserDatabase,
  getDummyUserObject,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = authenticatedUserTestingEnvironment;

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

beforeEach(async () => {
  await clearUserDatabase();
});

afterAll(async () => {
  await env.teardown();
});
describe('/api/users', () => {
  describe('POST /auth', () => {
    test('should auth user with success', async () => {
      // Arrange
      const user = getDummyUserObject();
      await axiosAPIClient.post('/api/users', user);
      const { email, password } = user;

      // Act
      const response = await axiosAPIClient.post('/api/users/auth', { email, password });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.user.email).toBe(user.email);
      expect(response.data.user.name.firstName).toBe(user.name.firstName);
    });

    test('should return 401 when user does not exist', async () => {
      // Arrange
      const { email, password } = {
        email: 'notRegistered@folan.teltan',
        password: 'folanTeltan1234',
      };

      // Act
      const response = await axiosAPIClient.post('/api/users/auth', { email, password });

      // Assert
      expect(response.status).toBe(404);
    });

    test('should return 401 when password is incorrect', async () => {
      // Arrange
      const user = getDummyUserObject();
      await axiosAPIClient.post('/api/users', user);
      const { email } = user;
      const password = 'wrongPassword';

      // Act
      const response = await axiosAPIClient.post('/api/users/auth', { email, password });

      // Assert
      expect(response.status).toBe(401);
    });
  });
});
