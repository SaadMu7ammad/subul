import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "pdf") {
      cb(null, true);
    } else {
      cb(new Error("Not a PDF File!!"), false);
    }
  };
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'uploads/docsCharities');
    },
    filename: (req, file, cb) => {
       const uniqueSuffix = 'docCharity' + uuidv4() + '-' + Date.now();
       const filename = uniqueSuffix + '.pdf';
       cb(null, filename);
    }
});
const pdfUpload = multer({ storage,fileFilter:multerFilter }).single('pdf');
export {pdfUpload};