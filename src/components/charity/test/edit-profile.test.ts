import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import {
  EDIT_CHARITY_PROFILE_DATA,
  authenticatedCharityTestingEnvironment,
} from '@utils/test-helpers';
import { AxiosInstance } from 'axios';

let axiosAPIClient: AxiosInstance;

const env = authenticatedCharityTestingEnvironment;

beforeAll(async () => {
  ({ axiosAPIClient } = await env.setup());
});

afterAll(async () => {
  await env.teardown();
});

describe('api/charities', () => {
  describe('PUT /edit-profile', () => {
    test('Should edit profile with 200 status code', async () => {
      // Arrange
      const charityData = {
        name: EDIT_CHARITY_PROFILE_DATA.name,
        location: {
          governorate: EDIT_CHARITY_PROFILE_DATA.location.governorate,
          city: EDIT_CHARITY_PROFILE_DATA.location.city,
        },
        description: EDIT_CHARITY_PROFILE_DATA.description,
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
          governorate: EDIT_CHARITY_PROFILE_DATA.location.governorate,
          city: EDIT_CHARITY_PROFILE_DATA.location.city,
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
        email: EDIT_CHARITY_PROFILE_DATA.email,
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
