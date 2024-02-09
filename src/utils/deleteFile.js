import fs from 'fs';
import path from 'path';
import logger from './logger.js';
import Cloudinary from './cloudinary.js';
import * as configurationProvider from '../libraries/configuration-provider/index.js';
const deleteFile = (filePath) => {
  logger.warn(filePath);
  fs.unlink(filePath, (err) => {
    if (err) logger.error(err);
    else logger.info('The File is Deleted Successfully!');
  });
};

const deleteFiles = (pathToFolder, folderName, ...filesNames) => {
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

const deleteOldImgs = (imgsFolder, imgsNames) => {
  const cloudinaryObj = new Cloudinary();

  const imgsNamesArray = Array.isArray(imgsNames) ? imgsNames : [imgsNames];

  if (configurationProvider.getValue('environment.nodeEnv') === 'development') {
    deleteFiles('./uploads', imgsFolder, ...imgsNamesArray);
  } else if (
    configurationProvider.getValue('environment.nodeEnv') === 'production'
  ) {
    imgsNamesArray.forEach((imgName) => {
      cloudinaryObj.deleteImg(imgsFolder, imgName?.split('.jpeg')[0]);
    });
  }

  imgsNamesArray.length = 0;
};

const deleteCharityDocs = (req, type) => {
    if (type === 'charityDocs' || type === 'all') {
        for(let i = 1 ; i<=4;++i){
          deleteOldImgs('docsCharities', req?.body?.charityDocs[`docs${i}`]);
        }
    } if (type === 'payment' || type === 'all') {
      console.log('please',Object.keys(req.body));
        [
            ['bankAccount', 'docsBank'],
            ['fawry', 'docsFawry'],
            ['vodafoneCash', 'docsVodafoneCash'],
        ].forEach((pm) => {
            let paymentMethod = pm[0];
            let paymentDocs = pm[1];
            let paymentMethodObj = req.body.paymentMethods[paymentMethod];
            if (paymentMethodObj && paymentMethodObj[0][paymentDocs])
                deleteOldImgs('docsCharities', paymentMethodObj[0][paymentDocs]);
        });
    }
};

export { deleteFile, deleteFiles, deleteOldImgs ,deleteCharityDocs};
