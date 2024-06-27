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
  describe('GET /:id', () => {
    test('Should return 404 if No such UsedItem with this ID exists', async () => {
      //Arrange
      const usedItemId = '60b1f1b1b4b4f3f1b4b4f3f1';

      //Act
      const { status, data } = await axiosAPIClient.get(`api/usedItem/${usedItemId}`);

      //Assert
      expect(status).toBe(404);
      expect(data.message).toMatch('No such UsedItem');
    });
  });
});
