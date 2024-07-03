import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  DUMMY_USED_ITEM,
  NON_EXISTING_ID,
  clearUsedItemsDatabase,
  usedItemTestingEnvironment,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let userAxiosAPIClient: AxiosInstance;

let charityAxiosAPIClient: AxiosInstance;

const env = usedItemTestingEnvironment;

const usedItem = {
  title: DUMMY_USED_ITEM.title,
  category: DUMMY_USED_ITEM.category,
  description: DUMMY_USED_ITEM.description,
  images: [DUMMY_USED_ITEM.images[0]],
  amount: DUMMY_USED_ITEM.amount,
};

beforeAll(async () => {
  ({ userAxiosAPIClient, charityAxiosAPIClient } = await env.setup());
});

beforeEach(async () => {
  await clearUsedItemsDatabase();
});

afterAll(async () => {
  await env.teardown();
});

describe('api/charities/confirmBookingReceipt', () => {
  describe('POST /:id', () => {
    test('Should return 200 when confirming booking the usedItem , and When we retrieve it , is should be confirmed', async () => {
      //Arrange
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
      const usedItemId = NON_EXISTING_ID;

      //Act
      const confirmBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/confirmBookingReceipt/${usedItemId}`
      );

      //Assert
      expect(confirmBookingUsedItemResponse.status).toBe(404);
    });

    test('Should return 404 when confirming booking the usedItem that is not booked', async () => {
      //Arrange
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
