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
import { postCaseValidation } from '../utils/validatorComponents/case/postCaseValidation.js';
import { validate } from '../middlewares/validatorMiddleware.js';
import { editCaseValidation } from '../utils/validatorComponents/case/editCaseValidation.js';
import getAllCasesValidation from '../utils/validatorComponents/case/getAllCasesValidation.js';
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
