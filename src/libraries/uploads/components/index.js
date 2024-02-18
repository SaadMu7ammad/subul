import * as configurationProvider from '../../configuration-provider/index.js';
import Cloudinary from '../../../utils/cloudinary.js';
const saveImg = async (sharpPromise, destinationFolder, fileName) => {
    const cloudinaryObj = new Cloudinary();

    const environment = configurationProvider.getValue('environment.nodeEnv');

    if (environment === 'development') {
        //saving locally
        await sharpPromise.toFile(`./uploads/${destinationFolder}/` + fileName);
    } else if (environment === 'production') {
        //saving to cloudniary
        const resizedImgBuffer = await sharpPromise.toBuffer();
        const uploadResult = await cloudinaryObj.uploadImg(
            resizedImgBuffer,
            destinationFolder,
            fileName.split('.jpeg')[0]
        );
        console.log({ imgUrl: uploadResult.secure_url });
    }
};

const getImageConfiguration = (path) => {
    let suffix;
    let destinationFolder;

    if (path === '/register' || path === '/edit-profileImg') {
        (destinationFolder = 'charityLogos'), (suffix = 'charityLogo');
    } else {
        (destinationFolder = 'caseCoverImages'), (suffix = 'caseCoveImage');
    }

    return { destinationFolder, suffix };
};
export { saveImg,getImageConfiguration };
