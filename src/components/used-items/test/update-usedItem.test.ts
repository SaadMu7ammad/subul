import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  DUMMY_USED_ITEM,
  NON_EXISTING_ID,
  UPDATED_DUMMY_USED_ITEM,
  authenticatedUserTestingEnvironment,
  clearUsedItemsDatabase,
} from '@utils/test-helpers';
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

describe('api/usedItem', () => {
  describe('PUT /:id', () => {
    test('should return 200 when updating a usedItem, and values should be updated', async () => {
      //Arrange
      const usedItem = {
        title: DUMMY_USED_ITEM.title,
        category: DUMMY_USED_ITEM.category,
        description: DUMMY_USED_ITEM.description,
        images: [DUMMY_USED_ITEM.images[0], DUMMY_USED_ITEM.images[1]],
        amount: DUMMY_USED_ITEM.amount,
      };
      const {
        data: { usedItem: createdUsedItem },
      } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const updatedUsedItem = {
        title: UPDATED_DUMMY_USED_ITEM.title,
        category: UPDATED_DUMMY_USED_ITEM.category,
        description: UPDATED_DUMMY_USED_ITEM.description,
        amount: UPDATED_DUMMY_USED_ITEM.amount,
      };
      //Act
      const { status, data } = await axiosAPIClient.put(
        `/api/usedItem/${createdUsedItem._id}`,
        updatedUsedItem
      );

      //Assert
      expect(status).toBe(200);
      expect(data.usedItem.title).toBe(updatedUsedItem.title);
      expect(data.usedItem.category).toBe(updatedUsedItem.category);
      expect(data.usedItem.description).toBe(updatedUsedItem.description);
      expect(data.usedItem.amount).toBe(updatedUsedItem.amount);
      expect(data.message).toMatch(/.*updated successfully.*/i);
    });
  });

  test('should return 400 when updating a usedItem with invalid values', async () => {
    //Arrange

    const usedItem = {
      title: DUMMY_USED_ITEM.title,
      category: DUMMY_USED_ITEM.category,
      description: DUMMY_USED_ITEM.description,
      images: [DUMMY_USED_ITEM.images[0], DUMMY_USED_ITEM.images[1]],
      amount: DUMMY_USED_ITEM.amount,
    };
    const {
      data: { usedItem: createdUsedItem },
    } = await axiosAPIClient.post('/api/usedItem', usedItem);

    const updatedUsedItem = {
      title: UPDATED_DUMMY_USED_ITEM.title,
      category: UPDATED_DUMMY_USED_ITEM.category,
      description: UPDATED_DUMMY_USED_ITEM.description,
      amount: -UPDATED_DUMMY_USED_ITEM.amount,
    };
    //Act
    const { status } = await axiosAPIClient.put(
      `/api/usedItem/${createdUsedItem._id}`,
      updatedUsedItem
    );

    //Assert
    expect(status).toBe(400);
  });

  test('should return 404 when updating a usedItem that does not exist', async () => {
    //Arrange
    const updatedUsedItem = {
      title: UPDATED_DUMMY_USED_ITEM.title,
      category: UPDATED_DUMMY_USED_ITEM.category,
      description: UPDATED_DUMMY_USED_ITEM.description,
      amount: UPDATED_DUMMY_USED_ITEM.amount,
    };
    const nonExistingUsedItemId = NON_EXISTING_ID;
    //Act
    const { status } = await axiosAPIClient.put(
      `/api/usedItem/${nonExistingUsedItemId}`,
      updatedUsedItem
    );

    //Assert
    expect(status).toBe(404);
  });
});
