import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import { clearUserDatabase, createAxiosApiClient, getDummyUserObject } from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();

  axiosAPIClient = createAxiosApiClient(apiConnection.port);

  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

beforeEach(async () => {
  await clearUserDatabase();
});

afterAll(async () => {
  await clearUserDatabase();
  nock.enableNetConnect();
  mongoose.connection.close();
  stopWebServer();
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
