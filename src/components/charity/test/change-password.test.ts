import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import { clearCharityDatabase, createDummyCharityAndReturnToken } from '@utils/test-helpers';
import axios, { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const token = await createDummyCharityAndReturnToken();

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

afterAll(async () => {
  await clearCharityDatabase();
  nock.enableNetConnect();
  mongoose.connection.close();
  stopWebServer();
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
