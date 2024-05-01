import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { BadRequestError } from '../../../errors/components/index';
import { getImageConfiguration, saveImg } from '../index';
import { NextFunction, Response,Request } from 'express';

const multerStorage = multer.memoryStorage();
// type MulterFileFilter = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) => void;

const multerFilterOnlyImgs = (
  req:Request,
  file:Express.Multer.File,
  cb:(error: Error | null, acceptFile?: boolean) => void
): void => {
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

const resizeImg = async (
  req:Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) throw new BadRequestError('no cover/logo image uploaded');

    let { destinationFolder, suffix } = getImageConfiguration(req.path);
    
    const uniqueSuffix = suffix + uuidv4() + '-' + Date.now();
    const fileName = `${uniqueSuffix}--${req.body.name}.jpeg`;
    // storeImgsTempOnReq(req, fileName);
    const sharpPromise = sharp(req.file.buffer)
      .resize(320, 240)
      .toFormat('jpeg')
      .jpeg({ quality: 90 });

    await saveImg(sharpPromise, destinationFolder, fileName);

    //adding the fileName in the req.body
    addImgsToReqBody(req, fileName);

    next();
  } catch (err) {
    next(err);
  }
};

const addImgsToReqBody = (req: Request, fileName: string) => {
  req.body.image = []; //container for deleting imgs
  req.body.image.push(fileName);
};

export { imageAssertion, resizeImg };
