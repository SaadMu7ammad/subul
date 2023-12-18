import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadImg = async (imgBuffer) => {
    const uploadResult = await new Promise((resolve) => {
        cloudinary.uploader
            .upload_stream((error, uploadResult) => {
                return resolve(uploadResult);
            })
            .end(imgBuffer);
    });
    return uploadResult;
};

export {uploadImg};