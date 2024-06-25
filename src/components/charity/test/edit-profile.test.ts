import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { startWebServer, stopWebServer } from '@src/server';
import axios, { AxiosInstance } from 'axios';
import mongoose from 'mongoose';
import nock from 'nock';

import { clearCharityDatabase, createDummyCharityAndReturnToken } from './test-helpers';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const token = await createDummyCharityAndReturnToken();

  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
    headers: {
      cookie: `jwt=${token}`,
    },
  };
  axiosAPIClient = axios.create(axiosConfig);
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

afterAll(async () => {
  await clearCharityDatabase();
  nock.enableNetConnect();
  mongoose.connection.close();
  stopWebServer();
});

describe('api/charities', () => {
  describe('PUT /edit-profile', () => {
    test('Should edit profile with 200 status code', async () => {
      // Arrange
      const charityData = {
        name: 'Charity Name',
        location: {
          governorate: 'Cairo',
          city: 'apeCity',
        },
        description: 'this is a description',
      };

      // Act
      const editProfileResponse = await axiosAPIClient.put(
        '/api/charities/edit-profile',
        charityData
      );

      const getProfileResponse = await axiosAPIClient.get('/api/charities/profile');

      // Assert
      expect(editProfileResponse.status).toBe(200);
      expect(getProfileResponse.data.charity.name).toBe(charityData.name);
    });

    test('Should change the existing location when locationId is provided', async () => {
      const {
        data: {
          charity: { charityLocation },
        },
      } = await axiosAPIClient.get('/api/charities/profile');
      // Arrange
      const charityData = {
        location: {
          governorate: 'Cairo',
          city: 'apeCity',
        },
        locationId: charityLocation[0]._id,
      };

      // Act
      const editProfileResponse = await axiosAPIClient.put(
        '/api/charities/edit-profile',
        charityData
      );

      // Assert
      const {
        data: {
          charity: { charityLocation: editedCharityLocation },
        },
      } = await axiosAPIClient.get('/api/charities/profile');

      expect(editProfileResponse.status).toBe(200);
      expect(editedCharityLocation[0].governorate).toBe(charityData.location.governorate);
      expect(editedCharityLocation[0].city).toBe(charityData.location.city);
      expect(editedCharityLocation[0]._id).toBe(charityData.locationId);
    });

    test('When the email is changed, the old email should not be in the database & and Account needs to be verified again', async () => {
      // Arrange
      const charityData = {
        email: 'dummy@dummy.dummy',
      };

      // Act
      const editProfileResponse = await axiosAPIClient.put(
        '/api/charities/edit-profile',
        charityData
      );

      const getProfileResponse = await axiosAPIClient.get('/api/charities/profile');

      // Assert
      expect(editProfileResponse.status).toBe(200);
      expect(getProfileResponse.data.charity.email).toBe(charityData.email);
      expect(getProfileResponse.data.charity.emailVerification.isVerified).toBe(false);
      expect(getProfileResponse.data.charity.verificationCode).not.toBe('');
    });
  });
});
