import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

import Charity from '../data-access/models/charity.model';
// jest.setTimeout(30000);
import {
  clearCharityDatabase,
  createDummyCharityAndReturnToken,
  getDummyCharityObject,
} from './test-helpers';

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
  describe('POST /activate', () => {
    test('Should Activate Account and delete verificationCode from DB with 200 Status Code', async () => {
      // Arrange
      const charity = getDummyCharityObject();
      charity.verificationCode = '60CharToken60CharToken60CharToken60CharToken60CharToken60Cha';
      await Charity.create(charity);

      // Act
      const response = await axiosAPIClient.post('/api/charities/activate', {
        token: charity.verificationCode,
      });

      // Assert
      expect(response.status).toBe(200);
    });
  });
});
