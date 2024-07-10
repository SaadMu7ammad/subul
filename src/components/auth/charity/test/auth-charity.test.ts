import Charity from '@components/charity/data-access/models/charity.model';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  DUMMY_CHARITY,
  INVALID_PASSWORD,
  NON_EXISTING_EMAIL,
  clearCharityDatabase,
  getDummyCharityObject,
  unauthenticatedCharityTestingEnvironment,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = unauthenticatedCharityTestingEnvironment;

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

beforeEach(async () => {
  await clearCharityDatabase();
});

afterAll(async () => {
  await env.teardown();
});

describe('/api/charities', () => {
  describe('POST /auth', () => {
    test('should auth a charity with success', async () => {
      const charity = getDummyCharityObject();
      await Charity.create(charity);

      const response = await axiosAPIClient.post('/api/charities/auth', {
        email: charity.email,
        password: charity.password,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
    });
  });
  test("should not auth a charity with when Email doesn't exist", async () => {
    const response = await axiosAPIClient.post('/api/charities/auth', {
      email: NON_EXISTING_EMAIL,
      password: DUMMY_CHARITY.password,
    });

    expect(response.status).toBe(404);
  });
  test('should not auth a charity with when password is invalid', async () => {
    const charity = getDummyCharityObject();
    await Charity.create(charity);

    const response = await axiosAPIClient.post('/api/charities/auth', {
      email: DUMMY_CHARITY.email,
      password: INVALID_PASSWORD,
    });

    expect(response.status).toBe(401);
  });
});
