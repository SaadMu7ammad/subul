import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import {
  clearUsedItemsDatabase,
  clearUserDatabase,
  createAxiosApiClient,
  createDummyUserAndReturnToken,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const token = await createDummyUserAndReturnToken();

  axiosAPIClient = createAxiosApiClient(apiConnection.port, token);

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
    const { status } = await axiosAPIClient.put(
      `/api/usedItem/${createdUsedItem._id}`,
      updatedUsedItem
    );

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
