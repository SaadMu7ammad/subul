import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
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
  describe('PUT /:id/images', () => {
    test('should return 200 when deleting a usedItem image', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.jpg'],
        amount: 10,
      };

      const { data } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const deletedImageName = usedItem.images[0];

      //Act

      const response = await axiosAPIClient.put(`/api/usedItem/${data.usedItem._id}/images`, {
        imageName: deletedImageName,
      });

      //Assert
      expect(response.status).toBe(200);
    });
    test('should return 404 when deleting a usedItem image that does not exist', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.jpg'],
        amount: 10,
      };

      const { data } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const deletedImageName = 'image2.jpg';

      //Act

      const response = await axiosAPIClient.put(`/api/usedItem/${data.usedItem._id}/images`, {
        imageName: deletedImageName,
      });

      //Assert
      expect(response.status).toBe(404);
    });

    test('If the image is deleted It should not be in the usedItem anymore', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.jpg'],
        amount: 10,
      };

      const { data } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const deletedImageName = usedItem.images[0];

      //Act

      const response = await axiosAPIClient.put(`/api/usedItem/${data.usedItem._id}/images`, {
        imageName: deletedImageName,
      });

      //Assert
      expect(response.status).toBe(200);
      expect(response.data.usedItem.images).not.toContain(deletedImageName);
    });

    test('should return 404 when deleting an image of a usedItem that does not exist', async () => {
      //Arrange
      const usedItemId = '60f1b9b3b3b3b3b3b3b3b3b3';
      const deletedImageName = 'image2.jpg';
      //Act

      const response = await axiosAPIClient.put(`/api/usedItem/${usedItemId}/images`, {
        imageName: deletedImageName,
      });

      //Assert
      expect(response.status).toBe(404);
    });
  });
});
