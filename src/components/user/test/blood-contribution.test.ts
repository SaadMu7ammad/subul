import Case from '@components/case/data-access/models/case.model';
import Charity from '@components/charity/data-access/models/charity.model';
import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals';
import {
  NON_EXISTING_ID,
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

afterEach(async () => {
  await clearCaseDatabase();
  await clearCharityDatabase();
});

afterAll(async () => {
  await env.teardown();
});

describe('/api/users', () => {
  describe('GET /bloodContribution/:id', () => {
    test('Should send an email with case info if the caes is valid (not finished & has a private number)', async () => {
      // Arrange
      const charity = getDummyCharityObject();
      const createdCharity = await Charity.create(charity);

      const _case = {
        ...DUMMY_CASE,
        charity: createdCharity._id,
      };

      const createdCase = await Case.create(_case);

      // Act
      const response = await axiosAPIClient.get(`/api/users/bloodContribution/${createdCase._id}`);

      // Assert
      expect(response.status).toBe(200);
    });

    test('Should return 404 if the case is not found', async () => {
      // Act
      const response = await axiosAPIClient.get(`/api/users/bloodContribution/${NON_EXISTING_ID}`);

      // Assert
      expect(response.status).toBe(404);
    });

    test('Should return 400 if the case is finished', async () => {
      // Arrange
      const charity = getDummyCharityObject();
      const createdCharity = await Charity.create(charity);

      const _case = {
        ...DUMMY_CASE,
        charity: createdCharity._id,
      };

      const createdCase = await Case.create(_case);

      createdCase.finished = true;
      await createdCase.save();

      // Act
      const response = await axiosAPIClient.get(`/api/users/bloodContribution/${createdCase._id}`);

      // Assert
      expect(response.status).toBe(400);
    });
  });
});
