import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import {
  appendDummyImageToFormData,
  authenticatedCharityTestingEnvironment,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';
import FormData from 'form-data';

let axiosAPIClient: AxiosInstance;

const env = authenticatedCharityTestingEnvironment;

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

afterAll(async () => {
  await env.teardown();
});

describe('/api/charities', () => {
  describe('PUT /edit-profileImg', () => {
    test('Should Change profile image with 200 status code', async () => {
      const form = new FormData();
      appendDummyImageToFormData(form, 'image');

      const response = await axiosAPIClient.put(`/api/charities/edit-profileImg`, form, {
        headers: form.getHeaders(),
      });

      expect(response.status).toBe(200);
    });

    test('Should return 400 status code when no image is provided', async () => {
      const response = await axiosAPIClient.put(`/api/charities/edit-profileImg`);

      expect(response.status).toBe(400);
    });
  });
});
