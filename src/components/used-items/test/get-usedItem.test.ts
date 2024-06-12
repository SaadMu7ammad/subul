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
  describe('GET /:id', () => {
    test('Should return 404 if No such UsedItem with this ID exists', async () => {
      //Act
      const { status, data } = await axiosAPIClient.get('api/usedItem/60b1f1b1b4b4f3f1b4b4f3f1');

      //Assert
      expect(status).toBe(404);
      expect(data.message).toMatch('No such UsedItem');
    });
  });
});
