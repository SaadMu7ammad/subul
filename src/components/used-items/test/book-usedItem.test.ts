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

describe('api/charities/bookUsedItem', () => {
  describe('POST /:id', () => {
    test('should return 200 and when retrieving the usedItem it should be booked', async () => {
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
      const bookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/bookUsedItem/${createUsedItemResponse.data.usedItem._id}`
      );

      //Assert
      expect(bookingUsedItemResponse.status).toBe(400);
    });

    test('should return 404 when the usedItem does not exist', async () => {
      //Arrange
      const usedItemId = '60b1f1b1b4b4f3f1b4b4f3f1';

      //Act
      const bookingUsedItemResponse = await charityAxiosAPIClient.post(
        `/api/charities/bookUsedItem/${usedItemId}`
      );

      //Assert
      expect(bookingUsedItemResponse.status).toBe(404);
    });
  });
});
