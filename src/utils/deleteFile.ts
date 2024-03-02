import fs from 'fs';
import path from 'path';
import logger from './logger';
import Cloudinary from './cloudinary';
import * as configurationProvider from '../libraries/configuration-provider/index';
const deleteFile = (filePath:string) => {
  logger.warn(filePath);
  fs.unlink(filePath, (err) => {
    if (err) logger.error(err);
    else logger.info('File is Deleted Successfully!');
  });
};

const deleteFiles = (pathToFolder:string, folderName:string, ...filesNames:string[]) => {
  filesNames.forEach((fileName) => {
    if (fileName) {
      const filePath = path.join(pathToFolder, folderName, fileName);
      if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlinkSync(filePath);
        logger.info('File deleted successfully.');
      } else {
        logger.error('File does not exist.');
      }
    } else {
      logger.error('File does not exist.');
    }
  });
};

const deleteOldImgs = (imgsFolder:string, imgsNames:string|string[]) => {
  const cloudinaryObj = new Cloudinary();

  const imgsNamesArray = Array.isArray(imgsNames) ? imgsNames : [imgsNames];

  if (configurationProvider.getValue('environment.nodeEnv') === 'development') {
    deleteFiles('./uploads', imgsFolder, ...imgsNamesArray);
  } else if (
    configurationProvider.getValue('environment.nodeEnv') === 'production'
  ) {
    imgsNamesArray.forEach((imgName) => {
      if(imgName?.split('.jpeg')[0])
      cloudinaryObj.deleteImg(imgsFolder, imgName.split('.jpeg')[0] as string);
    });
  }

  imgsNamesArray.length = 0;
};

const deleteCharityDocs = (req, type:string) => {
    if (type === 'charityDocs' || type === 'all') {
        for(let i = 1 ; i<=4;++i){
          deleteOldImgs('charityDocs', req?.body?.charityDocs[`docs${i}`]);
        }
    } if (type === 'payment' || type === 'all') {
        [
            ['bankAccount', 'bankDocs'],
            ['fawry', 'fawryDocs'],
            ['vodafoneCash', 'vodafoneCashDocs'],
        ].forEach((pm) => {
            let paymentMethod = pm[0];
          let paymentDocs = pm[1];
          if (paymentMethod && paymentDocs) {
            let paymentMethodObj = req.body.paymentMethods[paymentMethod];
            if (paymentMethodObj && paymentMethodObj[0][paymentDocs])
              deleteOldImgs('charityDocs', paymentMethodObj[0][paymentDocs]);
          }
        });
    }
};

export { deleteFile, deleteFiles, deleteOldImgs ,deleteCharityDocs};
