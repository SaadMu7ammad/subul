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

describe('api/usedItem', () => {
  describe('GET /:id', () => {
    test('Should return 404 if No such UsedItem with this ID exists', async () => {
      //Arrange
      const usedItemId = '60b1f1b1b4b4f3f1b4b4f3f1';

      //Act
      const { status, data } = await axiosAPIClient.get(`api/usedItem/${usedItemId}`);

      //Assert
      expect(status).toBe(404);
      expect(data.message).toMatch('No such UsedItem');
    });
  });
});
