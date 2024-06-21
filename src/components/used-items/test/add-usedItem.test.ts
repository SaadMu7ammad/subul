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

describe('/api/usedItem', () => {
  describe('POST /', () => {
    test('When adding a new valid usedItem, Then should get back approval with 200 response', async () => {
      //This test is the only test in which we will simulate the real scenario of uploading images

      //Arrange
      const usedItem: { [key: string]: string | number } = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        amount: 10,
      };

      const formData = new FormData();

      for (const key in usedItem) {
        formData.append(key, usedItem[key]);
      }

      appendDummyImagesToFormData(formData);

      //Act
      const { data, status } = await axiosAPIClient.post('/api/usedItem', formData, {
        headers: formData.getHeaders(),
      });

      //Assert
      expect(status).toBe(200);
      expect(typeof data.usedItem._id).toBe('string');
      expect(data.usedItem._id).toBeDefined();
    });
  });
  test('When adding a new valid usedItem, Then should be able to retrieve it', async () => {
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
      data: { usedItem: fetchedUsedItem },
    } = await axiosAPIClient.post('/api/usedItem', usedItem);

    //Assert
    const { data, status } = await axiosAPIClient.get(`/api/usedItem/${fetchedUsedItem._id}`);
    expect(status).toBe(200);
    expect(data.usedItem._id).toBe(fetchedUsedItem._id);
    expect(data.usedItem.title).toBe(fetchedUsedItem.title);
  });
  test('when adding a usedItem with missing required fields, then should get back a 500 response', async () => {
    //Arrange
    const usedItem = {
      title: 'Used Item 1',
      category: 'clothes',
      description: 'This is a used item',
      amount: 10,
    };

    //Act
    const { status, data } = await axiosAPIClient.post('/api/usedItem', usedItem);

    //Assert
    expect(status).toBe(500);
    expect(data.message).toMatch('UsedItem validation failed');
  });
});
