import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

import { clearCharityDatabase, createDummyCharityAndReturnToken } from './test-helpers';

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
