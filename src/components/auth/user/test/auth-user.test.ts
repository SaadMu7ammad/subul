import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  INVALID_PASSWORD,
  NON_EXISTING_EMAIL,
  authenticatedUserTestingEnvironment,
  clearUserDatabase,
  getDummyUserObject,
} from '@utils/test-helpers';
import { DUMMY_USER } from '@utils/test-helpers/constants/user-constants';
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
        email: NON_EXISTING_EMAIL,
        password: DUMMY_USER.password,
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
      const password = INVALID_PASSWORD;

      // Act
      const response = await axiosAPIClient.post('/api/users/auth', { email, password });

      // Assert
      expect(response.status).toBe(401);
    });
  });
});
