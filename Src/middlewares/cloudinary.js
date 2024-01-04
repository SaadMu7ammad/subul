import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadImg = async (imgBuffer, folder, publicId) => {
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
};

const deleteImg = async (folder, publicId) => {
    cloudinary.uploader
        .destroy(`${folder}/${publicId}`)
        .then((result) => {
            if (result.result === 'not found') {
                throw new Error('Image not found!');
            }else if (result.result === 'ok')
                logger.info('Img Deleted Successfully!');
            else console.log(result);
        })
        .catch(logger.error);
};

export { uploadImg, deleteImg };
