import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import {
  appendDummyImageToFormData,
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

describe('/api/charities', () => {
  describe('PUT /edit-profileImg', () => {
    test('Should Change profile image with 200 status code', async () => {
      const form = new FormData();
      appendDummyImageToFormData(form, 'image');

      const response = await axiosAPIClient.put(`/api/charities/edit-profileImg`, form, {
        headers: form.getHeaders(),
      });

      expect(response.status).toBe(200);
    });

    test('Should return 400 status code when no image is provided', async () => {
      const response = await axiosAPIClient.put(`/api/charities/edit-profileImg`);

      expect(response.status).toBe(400);
    });
  });
});
