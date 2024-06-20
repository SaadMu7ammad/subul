import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

import { clearUserDatabase, getDummyUserObject } from './test-helpers';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();

  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
  };
  axiosAPIClient = axios.create(axiosConfig);
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
