import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@utils/server';
import axios, { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

import {
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
  describe('DELETE /:id', () => {
    test('When deleting an existing usedItem, Then it should return a 200 status', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.png', 'image2.png'],
        amount: 10,
      };

      //Act
      const {
        data: { usedItem: createdUsedItem },
      } = await axiosAPIClient.post('/api/usedItem', usedItem);
      const { status, data } = await axiosAPIClient.delete(`api/usedItem/${createdUsedItem._id}`);

      //Assert
      expect(status).toBe(200);
      expect(data.message).toMatch(/.*deleted successfully.*/i);
    });

    test('When deleting a non-existing usedItem, Then it should return a 404 status', async () => {
      //Arrange
      const nonExistingUsedItemId = '60f9d2f5e6b4f0e6d8e4e9a5';

      //Act
      const { status, data } = await axiosAPIClient.delete(`api/usedItem/${nonExistingUsedItemId}`);

      //Assert
      expect(status).toBe(404);
      expect(data.message).toMatch('No such UsedItem');
    });

    test('When deleting an existing usedItem, Then it should NOT be retrievable', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.png', 'image2.png'],
        amount: 10,
      };

      //Act
      const {
        data: { usedItem: createdUsedItem },
      } = await axiosAPIClient.post('/api/usedItem', usedItem);
      await axiosAPIClient.delete(`api/usedItem/${createdUsedItem._id}`);

      //Assert
      const { status, data } = await axiosAPIClient.get(`api/usedItem/${createdUsedItem._id}`);
      expect(status).toBe(404);
      expect(data.message).toMatch('No such UsedItem');
    });
  });
});
