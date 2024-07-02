import Charity from '@components/charity/data-access/models/charity.model';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  NON_EXISTING_CHARITY_EMAIL,
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
  describe('POST /reset', () => {
    test('Should Send a Request to reset password with 200 status code', async () => {
      //Arrange
      const charity = getDummyCharityObject();
      await Charity.create(charity);

      //Act
      const response = await axiosAPIClient.post('/api/charities/reset', {
        email: charity.email,
      });

      const fetchedCharity = await Charity.findOne({ email: charity.email });

      //Assert
      expect(response.status).toEqual(200);
      if (fetchedCharity) expect(fetchedCharity.verificationCode).toBeDefined();
    });

    test('Should Send a 404 status code when the email is not found', async () => {
      //Act
      const response = await axiosAPIClient.post('/api/charities/reset', {
        email: NON_EXISTING_CHARITY_EMAIL,
      });

      //Assert
      expect(response.status).toEqual(404);
    });
  });
});
