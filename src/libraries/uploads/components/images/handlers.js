import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { BadRequestError } from '../../../errors/components/index.js';
const multerStorage = multer.memoryStorage();

const multerFilterOnlyImgs = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //accepts imgs only
    cb(null, true);
  } else {
    cb(new BadRequestError('invalid type,Only images allowed'));
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilterOnlyImgs,
});
const imageAssertion = upload.single('image');

const resizeImg = async (req, res, next) => {
  let destinationFolder, suffix;
  try {
    if (!req.file) throw new BadRequestError('no cover/logo image uploaded');
    // req.temp = []; //container for deleting imgs
    //Saif:This Should Be Handled Better Than that , but we will go with it for now
    //waiting to see :what other routes will upload images ?
    if (req.path === '/register') {
      (destinationFolder = 'LogoCharities'), (suffix = 'LogoCharity');
    } else {
      (destinationFolder = 'casesCoverImages'), (suffix = 'caseCoveImage');
    }
    const uniqueSuffix = suffix + uuidv4() + '-' + Date.now();
    const fileName = uniqueSuffix + '.jpeg';
    // storeImgsTempOnReq(req, fileName);
    const sharpPromise = sharp(req.file.buffer)
      .resize(320, 240)
      .toFormat('jpeg')
      .jpeg({ quality: 90 });

    await saveImg(sharpPromise, destinationFolder, fileName);

    //adding the fileName in the req.body
    addImgsToReqBody(req,fileName)

    next();
  } catch (err) {
    next(err);
  }
};
const storeImgsTempOnReq = (req, fileName) => {
  req.temp = []; //container for deleting imgs
  req.temp.push(fileName);
};
const addImgsToReqBody = (req, fileName) => {
  req.body.image = []; //container for deleting imgs
  req.body.image.push(fileName);
};
const saveImg = async (sharpPromise, destinationFolder, fileName) => {
  if (process.env.NODE_ENV === 'development') {
    //saving locally
    await sharpPromise.toFile(`./uploads/${destinationFolder}/` + fileName);
  } else if (process.env.NODE_ENV === 'production') {
    //saving to cloudniary

    const resizedImgBuffer = await sharpPromise.toBuffer();
    const uploadResult = await uploadImg(
      resizedImgBuffer,
      destinationFolder,
      fileName.split('.jpeg')[0]
    );
    console.log({ imgUrl: uploadResult.secure_url });
  }
};
export { imageAssertion, resizeImg };
