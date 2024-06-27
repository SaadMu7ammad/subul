import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import mongoose from 'mongoose';
import nock from 'nock';
import path from 'path';

import { clearCharityDatabase, createDummyCharityAndReturnToken } from './charity-test-helpers';
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
  axiosClientType: 'user' | 'charity' | 'both';
  authenticated: boolean;
  usedDbs: string[]; // Array of database identifiers (e.g., 'charity', 'user', 'usedItem', etc.)
}

export class TestingEnvironment {
  axiosAPIClient?: AxiosInstance;
  userAxiosAPIClient?: AxiosInstance;
  charityAxiosAPIClient?: AxiosInstance;
  axiosClientType: 'user' | 'charity' | 'both';
  authenticated: boolean;
  usedDbs: string[];

  constructor(options: TestingEnvironmentOptions) {
    this.axiosClientType = options.axiosClientType;
    this.authenticated = options.authenticated;
    this.usedDbs = options.usedDbs;
  }

  private async getToken() {
    if (this.axiosClientType === 'both') {
      return {
        charityToken: await createDummyCharityAndReturnToken(),
        userToken: await createDummyUserAndReturnToken(),
      };
    }
    if (this.axiosClientType === 'charity') {
      return await createDummyCharityAndReturnToken();
    }
    if (this.axiosClientType === 'user') {
      return await createDummyUserAndReturnToken();
    }
    return '';
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

  private async createAxiosAPIClients() {
    const apiConnection = await startWebServer();
    let token = '';
    let charityToken = '';
    let userToken = '';

    if (this.authenticated) {
      const tokens = await this.getToken();
      if (this.axiosClientType === 'both') {
        const { charityToken: ct, userToken: ut } = tokens as {
          charityToken: string;
          userToken: string;
        };
        charityToken = ct;
        userToken = ut;
      } else {
        token = tokens as string;
      }
    }

    if (this.axiosClientType === 'both') {
      this.charityAxiosAPIClient = this.createAxiosApiClient(apiConnection.port, charityToken);
      this.userAxiosAPIClient = this.createAxiosApiClient(apiConnection.port, userToken);
    } else {
      this.axiosAPIClient = this.createAxiosApiClient(apiConnection.port, token);
    }
  }

  async setup() {
    try {
      await this.createAxiosAPIClients();

      nock.disableNetConnect();

      nock.enableNetConnect('127.0.0.1');
    } catch (error) {
      console.error('Error setting up testing environment:', error);
      throw error;
    }

    if (this.axiosClientType === 'both') {
      return {
        charityAxiosAPIClient: this.charityAxiosAPIClient,
        userAxiosAPIClient: this.userAxiosAPIClient,
      };
    }
    return this.axiosAPIClient;
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
            await clearUserDatabase();
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
