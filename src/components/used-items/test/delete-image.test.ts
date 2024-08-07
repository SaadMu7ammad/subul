import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  DUMMY_USED_ITEM,
  NON_EXISTING_ID,
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
  describe('PUT /:id/images', () => {
    test('should return 200 when deleting a usedItem image', async () => {
      //Arrange
      const { data } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const deletedImageName = usedItem.images[0];

      //Act

      const response = await axiosAPIClient.put(`/api/usedItem/${data.usedItem._id}/images`, {
        imageName: deletedImageName,
      });

      //Assert
      expect(response.status).toBe(200);
    });
    test('should return 404 when deleting a usedItem image that does not exist', async () => {
      //Arrange
      const { data } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const deletedImageName = 'image2.jpg';

      //Act

      const response = await axiosAPIClient.put(`/api/usedItem/${data.usedItem._id}/images`, {
        imageName: deletedImageName,
      });

      //Assert
      expect(response.status).toBe(404);
    });

    test('If the image is deleted It should not be in the usedItem anymore', async () => {
      //Arrange
      const { data } = await axiosAPIClient.post('/api/usedItem', usedItem);

      const deletedImageName = usedItem.images[0];

      //Act

      const response = await axiosAPIClient.put(`/api/usedItem/${data.usedItem._id}/images`, {
        imageName: deletedImageName,
      });

      //Assert
      expect(response.status).toBe(200);
      expect(response.data.usedItem.images).not.toContain(deletedImageName);
    });

    test('should return 404 when deleting an image of a usedItem that does not exist', async () => {
      //Arrange
      const usedItemId = NON_EXISTING_ID;
      const deletedImageName = 'image2.jpg';
      //Act

      const response = await axiosAPIClient.put(`/api/usedItem/${usedItemId}/images`, {
        imageName: deletedImageName,
      });

      //Assert
      expect(response.status).toBe(404);
    });
  });
});
