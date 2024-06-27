import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import {
  appendBankInfoToFormData,
  appendDocsToFormData,
  clearCharityDatabase,
  createAxiosApiClient,
  createDummyCharityAndReturnToken,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import FormData from 'form-data';
import mongoose from 'mongoose';
import nock from 'nock';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const token = await createDummyCharityAndReturnToken(true, false);

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
  describe('POST /send-docs', () => {
    test('Should send docs to make charity status : isPending , with 200 status code', async () => {
      // Arrange
      const formData = new FormData();

      appendBankInfoToFormData(formData);

      appendDocsToFormData(formData);

      // Act
      const response = await axiosAPIClient.post('/api/charities/send-docs', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      const getProfileResponse = await axiosAPIClient.get('/api/charities/profile');

      // Assert
      expect(response.status).toBe(200);
      expect(getProfileResponse.data.charity.isPending).toBe(true);
    });
  });
});

/*
There are many many checks that can be done here, but I will just do the basic one. 😡😡😡😡
*/
