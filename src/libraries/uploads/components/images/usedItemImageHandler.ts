import { BadRequestError } from '@libs/errors/components';
import { saveImg } from '@libs/uploads/components';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { upload } from './handlers';

const imageAssertion = upload.array('images', 5);

const resizeImg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (Array.isArray(req.files) && !req.files.length)
      throw new BadRequestError('no image uploaded');

    const destinationFolder = 'usedItemsImages',
      suffix = 'usedItem-';

    if (Array.isArray(req.files)) {
      //type guard
      for (const file of req.files) {
        const uniqueSuffix = suffix + uuidv4() + '-' + Date.now();
        const fileName = uniqueSuffix + '.jpeg';

        const sharpPromise = sharp(file.buffer)
          .resize(320, 240)
          .toFormat('jpeg')
          .jpeg({ quality: 90 });

        await saveImg(sharpPromise, destinationFolder, fileName);

        req.body.images = Array.isArray(req.body.images)
          ? [...req.body.images, fileName]
          : [fileName];
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

export { imageAssertion, resizeImg };
