import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import {
  CharityTestingEnvironment,
  appendBankInfoToFormData,
  appendDocsToFormData,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import FormData from 'form-data';

let axiosAPIClient: AxiosInstance;

const env = new CharityTestingEnvironment(
  { authenticated: true, usedDbs: ['charity'] },
  { isActivated: true, isConfirmed: false, verificationCode: '' }
);

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

afterAll(async () => {
  await env.teardown();
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
