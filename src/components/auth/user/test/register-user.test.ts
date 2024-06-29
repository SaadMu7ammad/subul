import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  clearUserDatabase,
  getDummyUserObject,
  unauthenticatedUserTestingEnvironment,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = unauthenticatedUserTestingEnvironment;

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
  describe('POST /', () => {
    test('should register a new user with success', async () => {
      // Arrange
      const user = getDummyUserObject();
      // Act
      const response = await axiosAPIClient.post('/api/users', user);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.user.email).toBe(user.email);
      expect(response.data.user.name.firstName).toBe(user.name.firstName);
    });

    test('should return 400 when trying to register a user with an email that is already registered', async () => {
      // Arrange
      const user = getDummyUserObject();
      await axiosAPIClient.post('/api/users', user);

      // Act
      const response = await axiosAPIClient.post('/api/users', user);

      // Assert
      expect(response.status).toBe(400);
    });

    test('should return 400 when trying to register a user with invalid values', async () => {
      // Arrange
      const user = getDummyUserObject();
      user.email = 'invalid-email';

      // Act
      const response = await axiosAPIClient.post('/api/users', user);

      // Assert
      expect(response.status).toBe(400);
    });

    test('should return 500 when trying to register a user with missing values', async () => {
      // Arrange
      const user = getDummyUserObject();
      //@ts-expect-error // We are testing the API, so we can delete the email field
      delete user.email;

      // Act
      const response = await axiosAPIClient.post('/api/users', user);

      // Assert
      expect(response.status).toBe(500);
    });
  });
});
