import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';
import asyncHandler from 'express-async-handler';

import * as configurationProvider from '../libraries/configuration-provider/index.js';

class Cloudinary {
    constructor() {
        cloudinary.config({
            cloud_name: configurationProvider.getValue('cloudinary.cloudName'),
            api_key: configurationProvider.getValue('cloudinary.apiKey'),
            api_secret: configurationProvider.getValue('cloudinary.apiSecret'),
        });
    }
    uploadImg = asyncHandler(async (imgBuffer, folder, publicId) => {
        const uploadResult = await new Promise((resolve) => {
            cloudinary.uploader
                .upload_stream(
                    { folder, public_id: publicId },
                    (error, uploadResult) => {
                        return resolve(uploadResult);
                    }
                )
                .end(imgBuffer);
        });
        return uploadResult;
    });

    deleteImg = asyncHandler(async (folder, publicId) => {
        try {
            const result = await cloudinary.uploader.destroy(
                `${folder}/${publicId}`
            );

            if (result.result === 'not found') {
                throw new Error('Image not found!');
            } else if (result.result === 'ok') {
                logger.info('Img Deleted Successfully!');
            } else {
                console.log(result);
            }
        } catch (error) {
            logger.error(error);
        }
    });
}

export default Cloudinary;
