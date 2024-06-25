import Charity from '@components/charity/data-access/models/charity.model';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

import { clearCharityDatabase, getDummyCharityObject } from './test-helpers';

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
  await clearCharityDatabase();
});

afterAll(async () => {
  await clearCharityDatabase();
  nock.enableNetConnect();
  mongoose.connection.close();
  stopWebServer();
});

describe('/api/charities', () => {
  describe('POST /reset', () => {
    test('Should Send a Request to reset password with 200 status code', async () => {
      //Arrange
      const charity = getDummyCharityObject();
      await Charity.create(charity);

      //Act
      const response = await axiosAPIClient.post('/api/charities/reset', {
        email: charity.email,
      });

      const fetchedCharity = await Charity.findOne({ email: charity.email });

      //Assert
      expect(response.status).toEqual(200);
      if (fetchedCharity) expect(fetchedCharity.verificationCode).toBeDefined();
    });

    test('Should Send a 404 status code when the email is not found', async () => {
      //Act
      const response = await axiosAPIClient.post('/api/charities/reset', {
        email: 'none@none.ape',
      });

      //Assert
      expect(response.status).toEqual(404);
    });
  });
});