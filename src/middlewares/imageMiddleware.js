//disk Storage solution
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb(null, 'uploads/');
//     cb(null, './uploads/LogoCharities');
//   },
//   fileName: function (req, file, cb) {
//     // const imageUrl = file.path.replace("\\", "/");
//     const ex = file.mimetype.split('/')[1];
//     const uniqueSuffix ="LogoCharity"+uuidv4()+"-"+ Date.now() ;
//     cb(null, uniqueSuffix + '.' + ex);
//   },
// });
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { BadRequestError } from '../libraries/errors/components/bad-request.js';
import  Cloudinary from './cloudinary.js';
import * as configurationProvider from '../libraries/configuration-provider/index.js';

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

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        //accepts imgs only
        cb(null, true);
    } else {
        cb(new BadRequestError('invalid type,Only images allowed'));
    }
};

const resizeImg = asyncHandler(async (req, res, next) => {
    let uniqueSuffix;
    req.temp = []; //container for deleting imgs
    // const ex = file.mimetype.split('/')[1];
    let destinationFolder, suffix;
    //Saif:This Should Be Handled Better Than that , but we will go with it for now
    //waiting to see :what other routes will upload images ?
    if (req.path === '/') {
        (destinationFolder = 'LogoCharities'), (suffix = 'LogoCharity');
    } else {
        (destinationFolder = 'casesCoverImages'), (suffix = 'caseCoveImage');
    }
    if (!req.file) throw new BadRequestError('no cover/logo image uploaded');
    uniqueSuffix = suffix + uuidv4() + '-' + Date.now();
    const fileName = uniqueSuffix + '.jpeg';
    req.temp.push(fileName);

    const sharpPromise = sharp(req.file.buffer)
        .resize(320, 240)
        .toFormat('jpeg')
        .jpeg({ quality: 90 });
    
    await saveImg(sharpPromise, destinationFolder, fileName);

    //adding the fileName in the req.body
    req.body.image = fileName;

    next();
});
const resizeImgUpdated = asyncHandler(async (req, res, next) => {
    let uniqueSuffix;
    let destinationFolder, suffix;
    if (req.path === '/' || req.path === '/edit-profile') {
        (destinationFolder = 'LogoCharities'), (suffix = 'LogoCharity-');
    } else {
        (destinationFolder = 'casesCoverImages'), (suffix = 'caseCoveImage-');
    }
    req.temp = []; //container for deleting imgs
    // const ex = file.mimetype.split('/')[1];
    // if (!req.file) throw new BadRequestError('no cover/logo image uploaded')
    console.log('resizeImgUpdated');
    console.log(req.file);
    if (req.file && req.file.buffer) {
        if (req.body && req.body.name) {
            uniqueSuffix = suffix + req.body.name + uuidv4() + '-' + Date.now();
        } else if (req.charity.name) {
            uniqueSuffix =
                suffix + req.charity.name + uuidv4() + '-' + Date.now();
        }
        const fileName = uniqueSuffix + '.jpeg';
        req.temp.push(fileName);

        const sharpPromise = sharp(req.file.buffer)
            .resize(320, 240)
            .toFormat('jpeg')
            .jpeg({ quality: 90 });

        await saveImg(sharpPromise, destinationFolder, fileName);

        //adding the fileName in the req.body
        req.body.image = fileName;
    }
    next();
});

//diskStorage
// const upload = multer({ storage: multerStorage,fileFilter:multerFilter });
// const uploadCoverImage = upload.single('image');
//memoryStorage
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadCoverImage = upload.single('image');
const updateuploadCoverImage = upload.single('image');

export {
    uploadCoverImage,
    resizeImg,
    resizeImgUpdated,
    updateuploadCoverImage,
    saveImg,
};
