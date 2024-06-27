import Charity from '@components/charity/data-access/models/charity.model';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import {
  clearCharityDatabase,
  createAxiosApiClient,
  getDummyCharityObject,
} from '@utils/test-helpers';
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
  await clearCharityDatabase();
});

afterAll(async () => {
  await clearCharityDatabase();
  nock.enableNetConnect();
  mongoose.connection.close();
  stopWebServer();
});

describe('/api/charities', () => {
  describe('POST /auth', () => {
    test('should auth a charity with success', async () => {
      const charity = getDummyCharityObject();
      await Charity.create(charity);

      const response = await axiosAPIClient.post('/api/charities/auth', {
        email: charity.email,
        password: charity.password,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
    });
  });
  test('should not auth a charity with invalid credentials', async () => {
    const response = await axiosAPIClient.post('/api/charities/auth', {
      email: 'invalid-email',
      password: 'invalid-password',
    });

    expect(response.status).toBe(400);
  });
});
