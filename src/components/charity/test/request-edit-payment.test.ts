import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { CharityTestingEnvironment, appendBankInfoToFormData } from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import FormData from 'form-data';

let axiosAPIClient: AxiosInstance;

const env = new CharityTestingEnvironment({ authenticated: true, usedDbs: ['charity'] });

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

afterAll(async () => {
  await env.teardown();
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
