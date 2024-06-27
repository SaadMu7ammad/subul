import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import mongoose from 'mongoose';
import nock from 'nock';
import path from 'path';

import { clearCharityDatabase, createDummyCharityAndReturnToken } from './charity-test-helpers';
import { clearUsedItemsDatabase } from './usedItem-test-helpers';
import { clearUserDatabase, createDummyUserAndReturnToken } from './user-test-helpers';

export const appendDummyImageToFormData = (
  formData: FormData,
  imageName: string,
  numberOfImages: number = 1
) => {
  const imagePath = path.resolve(__dirname, 'test-image.png');
  const imageBuffer = fs.readFileSync(imagePath);
  for (let i = 1; i <= numberOfImages; i++) {
    formData.append(imageName, imageBuffer, `test-image${i}.png`);
  }
};

export const createAxiosApiClient = (port: number, token: string = '') => {
  const axiosConfig: CreateAxiosDefaults = {
    baseURL: `http://127.0.0.1:${port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
  };
  if (token) {
    axiosConfig['headers'] = {
      cookie: `jwt=${token}`,
    };
  }
  return axios.create(axiosConfig);
};

interface TestingEnvironmentOptions {
  authenticated: boolean;
  usedDbs: string[]; // Array of database identifiers (e.g., 'charity', 'user', 'usedItem', etc.)
}

export class TestingEnvironment {
  axiosAPIClient?: AxiosInstance;
  authenticated: boolean;
  usedDbs: string[];

  constructor(options: TestingEnvironmentOptions) {
    this.authenticated = options.authenticated;
    this.usedDbs = options.usedDbs;
  }

  createAxiosApiClient = (port: number, token: string = '') => {
    const axiosConfig: CreateAxiosDefaults = {
      baseURL: `http://127.0.0.1:${port}`,
      validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
    };
    if (token) {
      axiosConfig['headers'] = {
        cookie: `jwt=${token}`,
      };
    }
    return axios.create(axiosConfig);
  };

  async setup() {
    try {
      await this.createAxiosAPIClients();

      nock.disableNetConnect();
      nock.enableNetConnect('127.0.0.1');
    } catch (error) {
      console.error('Error setting up testing environment:', error);
      throw error;
    }

    return this.axiosAPIClient;
  }

  protected async createAxiosAPIClients() {
    throw new Error('createAxiosAPIClients method must be implemented by subclasses');
  }

  async teardown() {
    try {
      await this.clearDatabases(this.usedDbs);

      nock.enableNetConnect();
      await mongoose.connection.close();
      await stopWebServer();
    } catch (error) {
      console.error('Error tearing down testing environment:', error);
      throw error;
    }
  }

  async clearDatabases(usedDbs: string[]) {
    try {
      for (const db of usedDbs) {
        switch (db) {
          case 'charity':
            await clearCharityDatabase();
            break;
          case 'user':
            await clearUserDatabase();
            break;
          case 'usedItem':
            await clearUsedItemsDatabase();
            break;
          default:
            console.warn(`Unknown database type: ${db}. Skipping cleanup.`);
        }
      }
    } catch (error) {
      console.error('Error clearing databases:', error);
      throw error;
    }
  }
}

export class UserTestingEnvironment extends TestingEnvironment {
  constructor(options: TestingEnvironmentOptions) {
    super(options);
  }

  protected async createAxiosAPIClients() {
    const apiConnection = await startWebServer();
    let token = '';

    if (this.authenticated) {
      token = await createDummyUserAndReturnToken();
    }

    this.axiosAPIClient = this.createAxiosApiClient(apiConnection.port, token);
  }
}

export class CharityTestingEnvironment extends TestingEnvironment {
  constructor(options: TestingEnvironmentOptions) {
    super(options);
  }

  protected async createAxiosAPIClients() {
    const apiConnection = await startWebServer();
    let token = '';

    if (this.authenticated) {
      token = await createDummyCharityAndReturnToken();
    }

    this.axiosAPIClient = this.createAxiosApiClient(apiConnection.port, token);
  }
}

export class BothTestingEnvironment extends TestingEnvironment {
  userAxiosAPIClient: AxiosInstance;
  charityAxiosAPIClient: AxiosInstance;
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

  override async setup() {
    try {
      await this.createAxiosAPIClients();

      nock.disableNetConnect();
      nock.enableNetConnect('127.0.0.1');
    } catch (error) {
      console.error('Error setting up testing environment:', error);
      throw error;
    }

    return {
      charityAxiosAPIClient: this.charityAxiosAPIClient,
      userAxiosAPIClient: this.userAxiosAPIClient,
    };
  }
}
