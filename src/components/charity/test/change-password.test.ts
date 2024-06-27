import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import {
  clearCharityDatabase,
  createAxiosApiClient,
  createDummyCharityAndReturnToken,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const token = await createDummyCharityAndReturnToken();

  axiosAPIClient = createAxiosApiClient(apiConnection.port, token);

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
