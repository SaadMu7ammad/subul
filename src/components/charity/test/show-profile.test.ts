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
  describe('GET /profile', () => {
    test('should return the charity profile with 200 status code', async () => {
      //Act
      const response = await axiosAPIClient.get('/api/charities/profile');
      //Assert
      expect(response.status).toBe(200);
      expect(response.data.charity.email).toBe('dummy@dummy.ape');
    });
  });
});
