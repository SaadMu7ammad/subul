import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
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
/*
we need to spin up the server before running the tests. 
*/
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
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.png', 'image2.png'],
        amount: 10,
      };

      //Act
      const { data, status } = await axiosAPIClient.post('/api/usedItem', usedItem);

      //Assert
      expect(status).toBe(200);
      expect(typeof data.usedItem._id).toBe('string');
      expect(data.usedItem._id).toBeDefined();
    });
  });
});
