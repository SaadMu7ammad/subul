import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import {
  appendDummyImageToFormData,
  clearUsedItemsDatabase,
  clearUserDatabase,
  createAxiosApiClient,
  createDummyUserAndReturnToken,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import FormData from 'form-data';
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

      appendDummyImageToFormData(formData, 'images', 5);

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

    test('should return 400 when adding images to a used item that does not exist', async () => {
      //Arrange
      const formData = new FormData();

      appendDummyImageToFormData(formData, 'images', 5);

      const usedItemId = '60b1f1b1b4b3f1f1b1b4b3f1';

      //Act
      const response = await axiosAPIClient.post(`/api/usedItem/${usedItemId}/images`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      //Assert
      expect(response.status).toBe(404);
    });
  });

  test('should return 400 when adding images to a used item with invalid image files', async () => {
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

    formData.append('images', 'invalid-image-file');

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
    expect(response.status).toBe(400);
  });
});
