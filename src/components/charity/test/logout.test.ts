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
  describe('POST /logout', () => {
    test('should logout the charity and delete the cookie with 200 status code', async () => {
      //Act
      const response = await axiosAPIClient.post('/api/charities/logout');

      //Simulating browser behavior
      if (response.headers['set-cookie'] && response.headers['set-cookie'][0])
        axiosAPIClient.defaults.headers['cookie'] = response.headers['set-cookie'][0];

      //Assert
      expect(response.status).toBe(200);
      if (response.headers['set-cookie'])
        expect(response.headers['set-cookie'][0]).toMatch(/jwt=;/);
    });
  });
});
