import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';
import asyncHandler from 'express-async-handler';
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadImg = asyncHandler(async (imgBuffer, folder, publicId) => {
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

const deleteImg = asyncHandler(async (folder, publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(`${folder}/${publicId}`);

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

export { uploadImg, deleteImg };
