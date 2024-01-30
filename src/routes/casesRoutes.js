import express, { Router } from 'express';
import {
  addCase,
  deleteCase,
  editCase,
  getAllCases,
  getCaseById,
} from '../controllers/casesController.js';
import { auth, isConfirmed } from '../components/auth/shared/index.js';
import {
  uploadCoverImage,
  resizeImg,
  resizeImgUpdated,
} from '../middlewares/imageMiddleware.js';
import { validate } from '../libraries/validation/index.js';
import { postCaseValidation } from '../libraries/validation/components/case/postCaseValidation.js';
import { getAllCasesValidation } from '../libraries/validation/components/case/getAllCasesValidation.js';
import { editCaseValidation } from '../libraries/validation/components/case/editCaseValidation.js';
const router = express.Router();

router.get(
  '/allCases',
  auth,
  isConfirmed,
  getAllCasesValidation,
  validate,
  getAllCases
);
router
  .route('/cases/:caseId')
  .get(auth, isConfirmed, getCaseById)
  .delete(auth, isConfirmed, deleteCase)
  .put(
    auth,
    isConfirmed,
    uploadCoverImage,
    editCaseValidation,
    validate,
    resizeImgUpdated,
    editCase
  );
router.post(
  '/addCase',
  auth,
  isConfirmed,
  uploadCoverImage,
  postCaseValidation,
  validate,
  resizeImg,
  addCase
);
export default router;
