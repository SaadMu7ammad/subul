import fs from 'fs';
import path from 'path';
import logger from './logger.js';
const deleteFile = (filePath) => {
    logger.warn(filePath);
    fs.unlink(filePath, (err) => {
        if (err) logger.error(err);
        else logger.info('The File is Deleted Successfully!');
    });
};
export { deleteFile };
