import fs from 'fs';
import path from 'path';
import logger from './logger.js';
import 'dotenv/config.js'
const deleteFile = (filePath) => {
    logger.warn(filePath);
    fs.unlink(filePath, (err) => {
        if (err) logger.error(err);
        else logger.info('The File is Deleted Successfully!');
    });
};

const deleteFiles = (pathToFolder, folderName, ...filesNames) => {
    filesNames.forEach((fileName) => {
        const filePath = path.join(pathToFolder, folderName, fileName);
        if (fs.existsSync(filePath)) {
            // Delete the file
            fs.unlinkSync(filePath);
            console.log('File deleted successfully.');
        } else {
            console.log('File does not exist.');
        }
    });
};

const deleteOldImgs = (imgsFolder, imgsNames) => {
    const imgsNamesArray = Array.isArray(imgsNames) ? imgsNames : [imgsNames];

    if (process.env.NODE_ENV === 'development') {
        deleteFiles('./uploads', imgsFolder, ...imgsNamesArray);
    } else if (process.env.NODE_ENV === 'production') {
        imgsNamesArray.forEach((imgName) => {
            deleteImgFromCloudinary(imgsFolder, imgName.split('.jpeg')[0]);
        });
    }

    imgsNamesArray.length = 0;
};

deleteOldImgs('casesCoverImages', 'wallpaperflare.com_wallpaper.jpg');


export { deleteFile , deleteFiles , deleteOldImgs };
