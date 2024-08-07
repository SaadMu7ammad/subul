import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  DUMMY_USED_ITEM,
  authenticatedUserTestingEnvironment,
  clearUsedItemsDatabase,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = authenticatedUserTestingEnvironment;

const usedItem = {
  title: DUMMY_USED_ITEM.title,
  category: DUMMY_USED_ITEM.category,
  description: DUMMY_USED_ITEM.description,
  images: [DUMMY_USED_ITEM.images[0]],
  amount: DUMMY_USED_ITEM.amount,
};
beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

beforeEach(async () => {
  await clearUsedItemsDatabase();
});

afterAll(async () => {
  await env.teardown();
});

describe('api/usedItem', () => {
  describe('DELETE /:id', () => {
    test('When deleting an existing usedItem, Then it should return a 200 status', async () => {
      //Arrange
      //Act
      const {
        data: { usedItem: createdUsedItem },
      } = await axiosAPIClient.post('/api/usedItem', usedItem);
      const { status, data } = await axiosAPIClient.delete(`api/usedItem/${createdUsedItem._id}`);

      //Assert
      expect(status).toBe(200);
      expect(data.message).toMatch(/.*deleted successfully.*/i);
    });

    test('When deleting a non-existing usedItem, Then it should return a 404 status', async () => {
      //Arrange
      const nonExistingUsedItemId = '60f9d2f5e6b4f0e6d8e4e9a5';

      //Act
      const { status, data } = await axiosAPIClient.delete(`api/usedItem/${nonExistingUsedItemId}`);

      //Assert
      expect(status).toBe(404);
      expect(data.message).toMatch('No such UsedItem');
    });

    test('When deleting an existing usedItem, Then it should NOT be retrievable', async () => {
      //Act
      const {
        data: { usedItem: createdUsedItem },
      } = await axiosAPIClient.post('/api/usedItem', usedItem);
      await axiosAPIClient.delete(`api/usedItem/${createdUsedItem._id}`);

      //Assert
      const { status, data } = await axiosAPIClient.get(`api/usedItem/${createdUsedItem._id}`);
      expect(status).toBe(404);
      expect(data.message).toMatch('No such UsedItem');
    });
  });
});
