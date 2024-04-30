import { Request } from "express"; import { BadRequestError } from "../../../../errors/components";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from 'uuid';
const multerFilter = (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
    if (file.mimetype.split("/")[1] === "pdf") {
      cb(null, true);
    } else {
      cb(new BadRequestError('invalid type,Only PDFallowed')); 
    }
  };
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'uploads/charityDocs');
    },
    filename: (req, file, cb) => {
       const uniqueSuffix = 'charityDoc' + uuidv4() + '-' + Date.now();
       const filename = uniqueSuffix + '.pdf';
       cb(null, filename);
    }
});
const pdfUpload = multer({ storage,fileFilter:multerFilter }).single('pdf');
export {pdfUpload};