import * as configurationProvider from '@libs/configuration-provider/index';
import { NotFoundError } from '@libs/errors/components/not-found';
import Cloudinary from '@utils/cloudinary';
import { Sharp } from 'sharp';

const saveImg = async (
  sharpPromise: Sharp,
  destinationFolder: string,
  fileName: string | undefined
) => {
  const cloudinaryObj = new Cloudinary();

  const environment: string = configurationProvider.getValue('environment.nodeEnv');
  if (fileName && destinationFolder) {
    if (environment === 'development') {
      //saving locally
      await sharpPromise.toFile(`./uploads/${destinationFolder}/` + fileName);
    } else if (environment === 'production') {
      //saving to cloudniary
      const resizedImgBuffer = await sharpPromise.toBuffer();
      // const uploadResult =
      await cloudinaryObj.uploadImg(
        resizedImgBuffer,
        destinationFolder,
        fileName.split('.jpeg')[0] as string
      );
    }
  } else {
    throw new NotFoundError('no destination found...try again');
  }
};

const getImageConfiguration = (path: string) => {
  let suffix: string = '';
  let destinationFolder: string = '';

  if (path === '/register' || path === '/edit-profileImg') {
    (destinationFolder = 'charityLogos'), (suffix = 'charityLogo');
  } else {
    (destinationFolder = 'caseCoverImages'), (suffix = 'caseCoverImage');
  }

  return { destinationFolder, suffix };
};
export { saveImg, getImageConfiguration };
