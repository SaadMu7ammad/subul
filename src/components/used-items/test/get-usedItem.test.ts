import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  NON_EXISTING_ID,
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
  describe('GET /:id', () => {
    test('Should return 404 if No such UsedItem with this ID exists', async () => {
      //Arrange
      const usedItemId = NON_EXISTING_ID;

      //Act
      const { status, data } = await axiosAPIClient.get(`api/usedItem/${usedItemId}`);

      //Assert
      expect(status).toBe(404);
      expect(data.message).toMatch('No such UsedItem');
    });
  });
});
