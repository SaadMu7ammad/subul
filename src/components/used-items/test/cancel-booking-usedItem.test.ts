import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { clearUsedItemsDatabase, usedItemTestingEnvironment } from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let userAxiosAPIClient: AxiosInstance;

let charityAxiosAPIClient: AxiosInstance;

const env = usedItemTestingEnvironment;

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
      const cancelBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/cancelBookingOfUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Assert
      expect(cancelBookingUsedItemResponse.status).toBe(200);
      expect(cancelBookingUsedItemResponse.data.usedItem.booked).toBe(false);
    });

    test('Should return 400 when canceling usedItem booking that does not exist', async () => {
      //Arrange
      const usedItemId = '60b1f1b1b4b4f3f1b4b4f3f1';
      //Act
      const cancelBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/cancelBookingOfUsedItem/${usedItemId}`
      );

      //Assert
      expect(cancelBookingUsedItemResponse.status).toBe(400);
    });

    test('Should return 400 when canceling usedItem booking that is not booked', async () => {
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
      const cancelBookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/cancelBookingOfUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Assert
      expect(cancelBookingUsedItemResponse.status).toBe(400);
    });
  });
});
