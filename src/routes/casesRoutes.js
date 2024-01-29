import express, { Router } from 'express';
import {
  addCase,
  deleteCase,
  editCase,
  getAllCases,
  getCaseById,
} from '../controllers/casesController.js';
import { auth } from '../middlewares/authMiddleware.js';
import {
  uploadCoverImage,
  resizeImg,
  resizeImgUpdated,
} from '../middlewares/imageMiddleware.js';
import { isConfirmed } from '../middlewares/authStage2Middleware.js';
import { validate } from '../validation/index.js';
import { postCaseValidation } from '../validation/components/case/postCaseValidation.js';
import { getAllCasesValidation } from '../validation/components/case/getAllCasesValidation.js';
import { editCaseValidation } from '../validation/components/case/editCaseValidation.js';
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
