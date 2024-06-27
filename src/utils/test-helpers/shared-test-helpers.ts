import axios, { CreateAxiosDefaults } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

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
