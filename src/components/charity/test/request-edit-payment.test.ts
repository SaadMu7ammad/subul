import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import {
  appendBankInfoToFormData,
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
  describe('POST /request-edit-payment', () => {
    test('Should add new payment when no paymentId is provided with 200 status code ', async () => {
      // Arrange
      const formData = new FormData();

      appendBankInfoToFormData(formData);

      // Act
      const response = await axiosAPIClient.post('/api/charities/request-edit-payment', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      const getProfileResponse = await axiosAPIClient.get('/api/charities/profile');

      // Assert
      expect(response.status).toBe(200);
      expect(getProfileResponse.data.charity.paymentMethods.bankAccount.length).toEqual(2);
      expect(getProfileResponse.data.charity.paymentMethods.bankAccount[1].accNumber).toEqual(
        '1503070704120700019'
      );
    });

    test('Should update payment when paymentId is provided with 200 status code ', async () => {
      // Arrange
      const formData = new FormData();

      formData.append('payment_id', '65f9fcf93dbbeaaa8c2afec4');

      appendBankInfoToFormData(formData);

      // Act
      const response = await axiosAPIClient.post('/api/charities/request-edit-payment', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      const getProfileResponse = await axiosAPIClient.get('/api/charities/profile');

      // Assert
      expect(response.status).toBe(200);
      expect(getProfileResponse.data.charity.paymentMethods.bankAccount.length).toEqual(2);
      expect(getProfileResponse.data.charity.paymentMethods.bankAccount[0].accNumber).toEqual(
        '1503070704120700019'
      );
    });
  });
});
