import { beforeAll, describe } from '@jest/globals';
import axios from 'axios';

import { createDummyUserAndReturnToken } from './test-helpers';

let axiosAPIClient;

beforeAll(async () => {
  const token = await createDummyUserAndReturnToken();
  const axiosConfig = {
    baseURL: `http://localhost:${0}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
    headers: {
      cookie: `jwt=${token}`,
    },
  };
  axiosAPIClient = axios.create(axiosConfig);
});

describe('/api/usedItem', () => {
  describe('POST /', () => {});
});
