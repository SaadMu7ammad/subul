import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import {
  clearCharityDatabase,
  clearUsedItemsDatabase,
  clearUserDatabase,
  createAxiosApiClient,
  createDummyCharityAndReturnToken,
  createDummyUserAndReturnToken,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

let userAxiosAPIClient: AxiosInstance;
let charityAxiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const charityToken = await createDummyCharityAndReturnToken();
  const userToken = await createDummyUserAndReturnToken();

  userAxiosAPIClient = createAxiosApiClient(userToken, apiConnection.port);
  charityAxiosAPIClient = createAxiosApiClient(charityToken, apiConnection.port);

  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

beforeEach(async () => {
  await clearUsedItemsDatabase();
});

afterAll(async () => {
  await clearUserDatabase();
  await clearUsedItemsDatabase();
  await clearCharityDatabase();
  nock.enableNetConnect();
  mongoose.connection.close();
  stopWebServer();
});

describe('api/charities/confirmBookingReceipt', () => {
  describe('POST /:id', () => {
    test('Should return 200 when confirming booking the usedItem , and When we retrieve it , is should be confirmed', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.jpg'],
        amount: 10,
      };

      const createUsedItemResponse = await userAxiosAPIClient.post('/api/usedItem', usedItem);
      await charityAxiosAPIClient.post(
        `/api/charities/bookUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Act
      const confirmBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/confirmBookingReceipt/${createUsedItemResponse.data.usedItem._id}`
      );

      //Assert
      expect(confirmBookingUsedItemResponse.status).toBe(200);
      expect(confirmBookingUsedItemResponse.data.usedItem.booked).toBe(true);
      expect(confirmBookingUsedItemResponse.data.usedItem.confirmed).toBe(true);
    });

    test('Should return 404 when confirming booking the usedItem that does not exist', async () => {
      //Arrange
      const usedItemId = '60b1f1b1b4b4f3f1b4b4f3f1';

      //Act
      const confirmBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/confirmBookingReceipt/${usedItemId}`
      );

      //Assert
      expect(confirmBookingUsedItemResponse.status).toBe(404);
    });

    test('Should return 404 when confirming booking the usedItem that is not booked', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.jpg'],
        amount: 10,
      };

      const createUsedItemResponse = await userAxiosAPIClient.post('/api/usedItem', usedItem);

      //Act
      const confirmBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/confirmBookingReceipt/${createUsedItemResponse.data.usedItem._id}`
      );

      //Assert
      expect(confirmBookingUsedItemResponse.status).toBe(404);
    });
  });
});
