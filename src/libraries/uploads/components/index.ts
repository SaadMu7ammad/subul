import { Sharp } from 'sharp';

import Cloudinary from '../../../utils/cloudinary';
import * as configurationProvider from '../../configuration-provider/index';
import { NotFoundError } from '../../errors/components/not-found';

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
      const uploadResult = await cloudinaryObj.uploadImg(
        resizedImgBuffer,
        destinationFolder,
        fileName.split('.jpeg')[0] as string
      );
      //@ts-ignore
      console.log({ imgUrl: uploadResult.secure_url });
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
