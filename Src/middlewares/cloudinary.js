import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//TODO : HANDLING IMG NAME AND FOLDER :Done
//       HANLDING DELETING IMG
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
        .then((result) => console.log(result));
};

export { uploadImg,deleteImg };
