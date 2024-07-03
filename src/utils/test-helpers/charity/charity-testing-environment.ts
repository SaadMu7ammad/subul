import { startWebServer } from '@src/server';
import { AxiosInstance } from 'axios';

import { TestingEnvironment, TestingEnvironmentOptions } from '../shared/testing-environments';
import { createDummyCharityAndReturnToken } from './charity-test-helpers';

type CharityOptions = {
  isActivated: boolean;
  isConfirmed: boolean;
  verificationCode: string;
};

export class CharityTestingEnvironment extends TestingEnvironment {
  constructor(
    options: TestingEnvironmentOptions,
    private charityOptions: CharityOptions = {
      isActivated: true,
      isConfirmed: true,
      verificationCode: '',
    }
  ) {
    super(options);
  }

  protected async createAxiosAPIClients() {
    const apiConnection = await startWebServer();
    let token = '';

    if (this.authenticated) {
      const { isActivated, isConfirmed, verificationCode } = this.charityOptions;
      token = await createDummyCharityAndReturnToken(isActivated, isConfirmed, verificationCode);
    }

    this.axiosAPIClient = this.createAxiosApiClient(apiConnection.port, token);
  }

  override async setup(): Promise<{ axiosAPIClient: AxiosInstance }> {
    await super.setup();
    if (!this.axiosAPIClient) {
      throw new Error('axiosAPIClient not created');
    }
    return { axiosAPIClient: this.axiosAPIClient };
  }
}

export const authenticatedCharityTestingEnvironment = new CharityTestingEnvironment({
  authenticated: true,
  usedDbs: ['charity'],
});
export const unauthenticatedCharityTestingEnvironment = new CharityTestingEnvironment({
  authenticated: true,
  usedDbs: ['charity'],
});
