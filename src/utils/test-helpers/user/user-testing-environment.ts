import { startWebServer } from '@src/server';
import { AxiosInstance } from 'axios';

import { createDummyUserAndReturnToken } from '..';
import { TestingEnvironment, TestingEnvironmentOptions } from '../shared/testing-environments';

type UserOptions = {
  isEnabled: boolean;
  isVerified: boolean;
  verificationCode: string;
};

export class UserTestingEnvironment extends TestingEnvironment {
  constructor(
    options: TestingEnvironmentOptions,
    private userOptions: UserOptions = {
      isEnabled: true,
      isVerified: true,
      verificationCode: 'dummy',
    }
  ) {
    super(options);
  }

  protected async createAxiosAPIClients() {
    const apiConnection = await startWebServer();
    let token = '';

    if (this.authenticated) {
      const { isEnabled, isVerified, verificationCode } = this.userOptions;
      token = await createDummyUserAndReturnToken(isEnabled, isVerified, verificationCode);
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

export const authenticatedUserTestingEnvironment = new UserTestingEnvironment({
  authenticated: true,
  usedDbs: ['user', 'usedItem'],
});

export const unauthenticatedUserTestingEnvironment = new UserTestingEnvironment({
  authenticated: true,
  usedDbs: ['user'],
});
