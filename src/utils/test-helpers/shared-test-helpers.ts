import axios from 'axios';
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
  formData.append(imageName, imageBuffer, 'test-image.png');
};

export const createAxiosApiClient = (token: string, port: number) => {
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
    headers: {
      cookie: `jwt=${token}`,
    },
  };
  return axios.create(axiosConfig);
};
