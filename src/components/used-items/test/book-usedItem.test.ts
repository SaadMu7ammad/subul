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

describe('api/charities/bookUsedItem', () => {
  describe('POST /:id', () => {
    test('should return 200 and when retrieving the usedItem it should be booked', async () => {
      //Arrange

      const createUsedItemResponse = await userAxiosAPIClient.post('/api/usedItem', usedItem);

      //Act
      const bookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/bookUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      const getUsedItemResponse = await userAxiosAPIClient.get(
        `/api/usedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Assert
      expect(bookingUsedItemResponse.status).toBe(200);
      expect(getUsedItemResponse.data.usedItem.booked).toBe(true);
    });

    test('should return 400 when the usedItem is already booked', async () => {
      //Arrange

      const createUsedItemResponse = await userAxiosAPIClient.post('/api/usedItem', usedItem);

      await charityAxiosAPIClient.post(
        `/api/charities/bookUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Act
      const bookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/bookUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Assert
      expect(bookingUsedItemResponse.status).toBe(400);
    });

    test('should return 404 when the usedItem does not exist', async () => {
      //Arrange
      const usedItemId = NON_EXISTING_ID;

      //Act
      const bookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/bookUsedItem/${usedItemId}`
      );

      //Assert
      expect(bookingUsedItemResponse.status).toBe(404);
    });
  });
});
