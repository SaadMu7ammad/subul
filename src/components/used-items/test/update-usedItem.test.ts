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
  describe('PUT /:id', () => {
    test('should return 200 when updating a usedItem, and values should be updated', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.png', 'image2.png'],
        amount: 10,
      };
      const {
        data: { usedItem: createdUsedItem },
      } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const updatedUsedItem = {
        title: 'updated Used Item 1',
        category: 'others',
        description: 'This is an updated used item',
        amount: 10,
      };
      //Act
      const { status, data } = await axiosAPIClient.put(
        `/api/usedItem/${createdUsedItem._id}`,
        updatedUsedItem
      );

      //Assert
      expect(status).toBe(200);
      expect(data.usedItem.title).toBe(updatedUsedItem.title);
      expect(data.usedItem.category).toBe(updatedUsedItem.category);
      expect(data.usedItem.description).toBe(updatedUsedItem.description);
      expect(data.usedItem.amount).toBe(updatedUsedItem.amount);
      expect(data.message).toMatch(/.*updated successfully.*/i);
    });
  });

  test('should return 400 when updating a usedItem with invalid values', async () => {
    //Arrange
    const usedItem = {
      title: 'Used Item 1',
      category: 'clothes',
      description: 'This is a used item',
      images: ['image1.png', 'image2.png'],
      amount: 10,
    };
    const {
      data: { usedItem: createdUsedItem },
    } = await axiosAPIClient.post('/api/usedItem', usedItem);

    const updatedUsedItem = {
      title: 'updated Used Item 1',
      category: 'others',
      description: 'This is an updated used item',
      amount: -10,
    };
    //Act
    const { status, data } = await axiosAPIClient.put(
      `/api/usedItem/${createdUsedItem._id}`,
      updatedUsedItem
    );
    console.log(data);

    //Assert
    expect(status).toBe(400);
  });

  test('should return 404 when updating a usedItem that does not exist', async () => {
    //Arrange
    const updatedUsedItem = {
      title: 'updated Used Item 1',
      category: 'others',
      description: 'This is an updated used item',
      amount: 10,
    };
    //Act
    const { status } = await axiosAPIClient.put(
      `/api/usedItem/60d0fe4d8c3b9e0015f1d8c5`,
      updatedUsedItem
    );

    //Assert
    expect(status).toBe(404);
  });
});
