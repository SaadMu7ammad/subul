import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import mongoose from 'mongoose';
import nock from 'nock';

import {
  appendDummyImagesToFormData,
  clearUsedItemsDatabase,
  clearUserDatabase,
  createDummyUserAndReturnToken,
} from './test-helpers';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const token = await createDummyUserAndReturnToken();

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
  await clearUsedItemsDatabase();
});

afterAll(async () => {
  await clearUserDatabase();
  await clearUsedItemsDatabase();
  nock.enableNetConnect();
  mongoose.connection.close();
  stopWebServer();
});

describe('api/usedItem', () => {
  describe('POST /:id/images', () => {
    test('should return 200 when adding images to a used item', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.jpg'],
        amount: 10,
      };

      const { data } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const formData = new FormData();

      appendDummyImagesToFormData(formData);

      //Act
      const response = await axiosAPIClient.post(
        `/api/usedItem/${data.usedItem._id}/images`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      //Assert
      expect(response.status).toBe(200);
      expect(response.data.message).toMatch(/.*added successfully.*/i);
      expect(response.data.usedItem.images.length).toBe(5);
    });
  });
});
