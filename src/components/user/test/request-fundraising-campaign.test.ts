import Charity from '@components/charity/data-access/models/charity.model';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  authenticatedUserTestingEnvironment,
  clearCharityDatabase,
  getDummyCharityObject,
} from '@utils/test-helpers';
import { clearCaseDatabase } from '@utils/test-helpers/case/case-test-helpers';
import { DUMMY_CASE } from '@utils/test-helpers/constants/case-constants';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = authenticatedUserTestingEnvironment;

beforeAll(async () => {
  const { axiosAPIClient: client } = await env.setup();
  axiosAPIClient = client;
});

beforeEach(async () => {
  await clearCaseDatabase();
  await clearCharityDatabase();
});

afterAll(async () => {
  await env.teardown();
});

describe('/api/users', () => {
  describe('POST /requestFundraisingCampaign', () => {
    test('Should make a fundraising Request with 200 status code', async () => {
      // Arrange
      const charity = getDummyCharityObject();
      const createdCharity = await Charity.create(charity);

      const _case = {
        ...DUMMY_CASE,
        charity: createdCharity._id,
        mainType: 'customizedCampaigns',
        subType: 'customizedCampaigns',
      };

      // Act
      const response = await axiosAPIClient.post('/api/users/requestFundraisingCampaign', _case);

      // Assert
      expect(response.status).toBe(200);
    });

    test('Should return 401 if the charity is not confirmed or activated', async () => {
      // Arrange
      const charity = getDummyCharityObject(false, false);
      const createdCharity = await Charity.create(charity);

      const _case = {
        ...DUMMY_CASE,
        charity: createdCharity._id,
        mainType: 'customizedCampaigns',
        subType: 'customizedCampaigns',
      };

      // Act
      const response = await axiosAPIClient.post('/api/users/requestFundraisingCampaign', _case);

      // Assert
      expect(response.status).toBe(401);
    });
  });
});
