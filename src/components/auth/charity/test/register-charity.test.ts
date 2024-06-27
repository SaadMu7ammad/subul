import Charity from '@components/charity/data-access/models/charity.model';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import {
  appendDummyCharityToFormData,
  appendDummyImageToFormData,
  clearCharityDatabase,
  getDummyCharityObject,
} from '@utils/test-helpers';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import mongoose from 'mongoose';
import nock from 'nock';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();

  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
  };
  axiosAPIClient = axios.create(axiosConfig);
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

beforeEach(async () => {
  await clearCharityDatabase();
});

afterAll(async () => {
  await clearCharityDatabase();
  nock.enableNetConnect();
  mongoose.connection.close();
  stopWebServer();
});

describe('/api/charities', () => {
  describe('POST /register', () => {
    test('should register a new charity with success', async () => {
      //Arrange
      const formData = new FormData();
      appendDummyImageToFormData(formData, 'image');
      appendDummyCharityToFormData(formData);

      //Act
      const response = await axiosAPIClient.post('/api/charities/register', formData, {
        headers: formData.getHeaders(),
      });

      //Assert
      expect(response.status).toBe(200);
    });
  });

  test('should not register a new charity with missing data', async () => {
    //Arrange
    const formData = new FormData();
    formData.append('name', 'Charity Name');

    //Act
    const response = await axiosAPIClient.post('/api/charities/register', formData, {
      headers: formData.getHeaders(),
    });

    //Assert
    expect(response.status).toBe(400);
  });

  test('should not register a charity with email already in use', async () => {
    //Arrange
    const formData = new FormData();
    appendDummyImageToFormData(formData, 'image');
    appendDummyCharityToFormData(formData);

    //Act
    //Store a charity with the same email
    await Charity.create(getDummyCharityObject());

    const response = await axiosAPIClient.post('/api/charities/register', formData, {
      headers: formData.getHeaders(),
    });

    //Assert
    expect(response.status).toBe(400);
  });
});
