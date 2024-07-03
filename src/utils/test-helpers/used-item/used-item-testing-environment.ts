import { startWebServer } from '@src/server';
import { AxiosInstance } from 'axios';

import { createDummyCharityAndReturnToken, createDummyUserAndReturnToken } from '..';
import { TestingEnvironment, TestingEnvironmentOptions } from '../shared/testing-environments';

export class UsedItemTestingEnvironment extends TestingEnvironment {
  userAxiosAPIClient?: AxiosInstance;
  charityAxiosAPIClient?: AxiosInstance;

  constructor(options: TestingEnvironmentOptions) {
    super(options);
  }

  protected async createAxiosAPIClients() {
    const apiConnection = await startWebServer();
    let charityToken = '';
    let userToken = '';

    if (this.authenticated) {
      charityToken = await createDummyCharityAndReturnToken();
      userToken = await createDummyUserAndReturnToken();
    }

    this.charityAxiosAPIClient = this.createAxiosApiClient(apiConnection.port, charityToken);
    this.userAxiosAPIClient = this.createAxiosApiClient(apiConnection.port, userToken);
  }

  override async setup(): Promise<{
    charityAxiosAPIClient: AxiosInstance;
    userAxiosAPIClient: AxiosInstance;
  }> {
    await super.setup();
    if (!this.charityAxiosAPIClient || !this.userAxiosAPIClient) {
      throw new Error('axiosAPIClients not created');
    }
    return {
      charityAxiosAPIClient: this.charityAxiosAPIClient,
      userAxiosAPIClient: this.userAxiosAPIClient,
    };
  }
}

export const usedItemTestingEnvironment = new UsedItemTestingEnvironment({
  authenticated: true,
  usedDbs: ['charity', 'usedItem', 'user'],
});
