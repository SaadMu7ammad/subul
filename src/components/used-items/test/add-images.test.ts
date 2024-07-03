import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  DUMMY_USED_ITEM,
  NON_EXISTING_ID,
  appendDummyImageToFormData,
  authenticatedUserTestingEnvironment,
  clearUsedItemsDatabase,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import FormData from 'form-data';

let axiosAPIClient: AxiosInstance;

const env = authenticatedUserTestingEnvironment;

const usedItem = {
  title: DUMMY_USED_ITEM.title,
  category: DUMMY_USED_ITEM.category,
  description: DUMMY_USED_ITEM.description,
  images: [DUMMY_USED_ITEM.images[0], DUMMY_USED_ITEM.images[1]],
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
  describe('POST /:id/images', () => {
    test('should return 200 when adding images to a used item', async () => {
      //Arrange
      const { data } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const formData = new FormData();

      appendDummyImageToFormData(formData, 'images', 5);

      //Act
      const response = await axiosAPIClient.post(
        `/api/usedItem/${data.usedItem._id}/images`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      //Assert
      expect(response.status).toBe(200);
      expect(response.data.message).toMatch(/.*added successfully.*/i);
      expect(response.data.usedItem.images.length).toBe(5);
    });

    test('should return 400 when adding images to a used item that does not exist', async () => {
      //Arrange
      const formData = new FormData();

      appendDummyImageToFormData(formData, 'images', 5);

      const usedItemId = NON_EXISTING_ID;

      //Act
      const response = await axiosAPIClient.post(`/api/usedItem/${usedItemId}/images`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      //Assert
      expect(response.status).toBe(404);
    });
  });

  test('should return 400 when adding images to a used item with invalid image files', async () => {
    //Arrange

    const { data } = await axiosAPIClient.post('/api/usedItem', usedItem);

    const formData = new FormData();

    formData.append('images', 'invalid-image-file');

    //Act
    const response = await axiosAPIClient.post(
      `/api/usedItem/${data.usedItem._id}/images`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    //Assert
    expect(response.status).toBe(400);
  });
});
