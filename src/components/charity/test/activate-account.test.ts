import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

import Charity from '../data-access/models/charity.model';
import { clearCharityDatabase, createDummyCharityAndReturnToken } from './test-helpers';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const token = await createDummyCharityAndReturnToken(
    false,
    false,
    '60CharToken60CharToken60CharToken60CharToken60CharToken60Cha'
  );

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

beforeEach(async () => {
  const charity = await Charity.findOne({ email: 'dummy@dummy.ape' });

  if (charity && charity.emailVerification && charity.verificationCode !== undefined) {
    charity.emailVerification.isVerified = false;

    charity.emailVerification.verificationDate = '';

    charity.verificationCode = '60CharToken60CharToken60CharToken60CharToken60CharToken60Cha';

    await charity.save();
  }
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
      // Act
      const response = await axiosAPIClient.post('/api/charities/activate', {
        token: '60CharToken60CharToken60CharToken60CharToken60CharToken60Cha',
      });

      // Assert
      const charity = await Charity.findOne({ email: 'dummy@dummy.ape' });

      expect(response.status).toBe(200);
      expect(charity?.emailVerification?.isVerified).toBe(true);
      expect(charity?.verificationCode).toBe('');
    });

    test('Should return 401 Status Code if token is invalid', async () => {
      // Act
      const response = await axiosAPIClient.post('/api/charities/activate', {
        token: 'invalidTokeninvalidTokeninvalidTokeninvalidTokeninvalidToken',
      });

      // Assert
      expect(response.status).toBe(401);
    });

    test('Should return 400 Status Code if account is already activated', async () => {
      // Arrange
      await axiosAPIClient.post('/api/charities/activate', {
        token: '60CharToken60CharToken60CharToken60CharToken60CharToken60Cha',
      });

      // Act
      const response = await axiosAPIClient.post('/api/charities/activate', {
        token: '60CharToken60CharToken60CharToken60CharToken60CharToken60Cha',
      });

      // Assert
      expect(response.status).toBe(400);
    });
  });
});
