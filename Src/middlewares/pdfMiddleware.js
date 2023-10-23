import multer from "multer";
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
       cb(null, file.originalname);
    }
});
const pdfUpload = multer({ storage,fileFilter:multerFilter });
export {pdfUpload};