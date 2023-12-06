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

const deleteOldImgs = (arr, selector) => {
    arr.map((img) => {
        const oldImagePath = path.join('./uploads/docsCharities', img);
        if (fs.existsSync(oldImagePath)) {
            // Delete the file
            fs.unlinkSync(oldImagePath);
            console.log('Old image deleted successfully.');
        } else {
            console.log('Old image does not exist.');
        }
    });
    arr = [];
};
export { deleteFile ,deleteOldImgs};
