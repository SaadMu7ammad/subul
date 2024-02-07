import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { BadRequestError } from '../../../../errors/components/bad-request.js';
import { saveImg } from '../../index.js';

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        //accepts imgs only
        cb(null, true);
    } else {
        cb(new BadRequestError('invalid type,Only images allowed'));
    }
};
async function processDocs(docsKey, ref, req) {
    return Promise.all(
        ref.map(async (obj, indx) => {
            const ex = obj.mimetype.split('/')[1];
            const uniquePrefix = uuidv4();
            const fileName = `${docsKey}-${req.charity.name}--${req.charity._id}--${indx}${uniquePrefix}.jpeg`;
            req.temp.push(fileName);

            const sharpPromise = sharp(obj.buffer)
                .resize(320, 240)
                .toFormat('jpeg')
                .jpeg({ quality: 90 });

            await saveImg(sharpPromise, 'docsCharities', fileName);

            if (
                req.body.paymentMethods &&
                req.body.paymentMethods.bankAccount &&
                docsKey === 'docsBank'
            ) {
                req.body.paymentMethods.bankAccount.docsBank.push(fileName);
            }
            if (
                req.body.paymentMethods &&
                req.body.paymentMethods.fawry &&
                docsKey === 'docsFawry'
            ) {
                req.body.paymentMethods.fawry.docsFawry.push(fileName);
            }
            if (
                req.body.paymentMethods &&
                req.body.paymentMethods.vodafoneCash &&
                docsKey === 'docsVodafoneCash'
            ) {
                req.body.paymentMethods.vodafoneCash.docsVodafoneCash.push(
                    fileName
                );
            }
        })
    ); 
}
const resizeDocReq = (async (req, res, next) => {
    req.temp = []; //container for deleting imgs
    if (req.body.paymentMethods && req.body.paymentMethods.bankAccount) {
        req.body.paymentMethods.bankAccount.docsBank = [];
    }
    if (req.body.paymentMethods && req.body.paymentMethods.fawry) {
        req.body.paymentMethods.fawry.docsFawry = [];
    }
    if (req.body.paymentMethods && req.body.paymentMethods.vodafoneCash) {
        req.body.paymentMethods.vodafoneCash.docsVodafoneCash = [];
    }

    // req.body.paymentMethods.fawry.docs = [];
    if (!req.files) {
        throw new BadRequestError('docs are required');
    }
    console.log(req.files);
    if (
        //if not upload docs
        !req.files['paymentMethods.bankAccount[0][docsBank]'] &&
        !req.files['paymentMethods.fawry[0][docsFawry]'] &&
        !req.files['paymentMethods.vodafoneCash[0][docsVodafoneCash]']
    ) {
        throw new BadRequestError('docs are required');
    }

    if (req.files['paymentMethods.bankAccount[0][docsBank]'])
        await processDocs(
            'docsBank',
            req.files['paymentMethods.bankAccount[0][docsBank]'],
            req
        );

    if (req.files['paymentMethods.fawry[0][docsFawry]'])
        await processDocs(
            'docsFawry',
            req.files['paymentMethods.fawry[0][docsFawry]'],
            req
        );

    if (req.files['paymentMethods.vodafoneCash[0][docsVodafoneCash]'])
        await processDocs(
            'docsVodafoneCash',
            req.files['paymentMethods.vodafoneCash[0][docsVodafoneCash]'],
            req
        );

    // await processDocs('docs', req.files[' paymentMethods[fawry][0][docs]'], req);

    next();
});

//diskStorage
// const upload = multer({ storage: multerStorage,fileFilter:multerFilter });
// const uploadCoverImage = upload.single('image');
//memoryStorage
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadDocsReq = upload.fields([
    { name: 'paymentMethods.bankAccount[0][docsBank]', maxCount: 2 },
    { name: 'paymentMethods.fawry[0][docsFawry]', maxCount: 2 },
    { name: 'paymentMethods.vodafoneCash[0][docsVodafoneCash]', maxCount: 2 },

    // { name: 'paymentMethods.fawry[0][docs]', maxCount: 2 },
    // { name: 'paymentMethods.vodafoneCash[0][docs]', maxCount: 2 },
]);

export { uploadDocsReq, resizeDocReq };
