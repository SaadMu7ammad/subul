import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { authenticatedUserTestingEnvironment, clearUsedItemsDatabase } from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = authenticatedUserTestingEnvironment;

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

beforeEach(async () => {
  await clearUsedItemsDatabase();
});

afterAll(async () => {
  await env.teardown();
});

describe('api/usedItem/', () => {
  describe('GET /getAllUsedItems', () => {
    test('should return 200 when getting all usedItems', async () => {
      //Act
      const response = await axiosAPIClient.get('/api/usedItem/getAllUsedItems');

      //Assert
      expect(response.status).toBe(200);
      expect(response.data.usedItems).toEqual([]);
    });

    test('should return 200 and return all usedItems when usedItems array is not empty', async () => {
      //Arrange
      const usedItem = {
        title: 'Used Item 1',
        category: 'clothes',
        description: 'This is a used item',
        images: ['image1.jpg'],
        amount: 10,
      };

      await axiosAPIClient.post('/api/usedItem', usedItem);

      //Act
      const response = await axiosAPIClient.get('/api/usedItem/getAllUsedItems');

      //Assert
      expect(response.status).toBe(200);
      expect(response.data.usedItems.length).toBe(1);
    });
  });
});
