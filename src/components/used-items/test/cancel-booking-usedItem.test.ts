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

describe('api/charities/cancelBookingOfUsedItem', () => {
  describe('POST /:id', () => {
    test('Should return 200 when canceling usedItem booking', async () => {
      //Arrange
      const createUsedItemResponse = await userAxiosAPIClient.post('/api/usedItem', usedItem);
      await charityAxiosAPIClient.post(
        `/api/charities/bookUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Act
      const cancelBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/cancelBookingOfUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Assert
      expect(cancelBookingUsedItemResponse.status).toBe(200);
      expect(cancelBookingUsedItemResponse.data.usedItem.booked).toBe(false);
    });

    test('Should return 400 when canceling usedItem booking that does not exist', async () => {
      //Arrange
      const usedItemId = NON_EXISTING_ID;
      //Act
      const cancelBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/cancelBookingOfUsedItem/${usedItemId}`
      );

      //Assert
      expect(cancelBookingUsedItemResponse.status).toBe(400);
    });

    test('Should return 400 when canceling usedItem booking that is not booked', async () => {
      //Arrange
      const createUsedItemResponse = await userAxiosAPIClient.post('/api/usedItem', usedItem);

      //Act
      const cancelBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/cancelBookingOfUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Assert
      expect(cancelBookingUsedItemResponse.status).toBe(400);
    });
  });
});
