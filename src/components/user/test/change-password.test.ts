import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

import { clearUserDatabase, createDummyUserAndReturnToken } from './test-helpers';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const token = await createDummyUserAndReturnToken();

  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
    headers: {
      cookie: `jwt=${token}`,
    },
  };
  axiosAPIClient = axios.create(axiosConfig);
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

beforeEach(async () => {});

afterAll(async () => {
  await clearUserDatabase();
  nock.enableNetConnect();
  mongoose.connection.close();
  stopWebServer();
});

describe('/api/users', () => {
  describe('PUT /changepassword', () => {
    test('should change password successfully with 200 status code', async () => {
      //Act
      const response = await axiosAPIClient.put('/api/users/changepassword', {
        password: 'newpassword',
      });

      //Assert
      expect(response.status).toBe(200);
    });
  });
});
