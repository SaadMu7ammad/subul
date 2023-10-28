import express, { Router } from 'express';
import {
    addCase,
    deleteCase,
    editCase,
    getAllCases,
    getCaseById,
} from '../Controllers/casesController.js';
import { auth } from '../middlewares/authMiddleware.js';
import { uploadCoverImage, resizeImg } from '../middlewares/imageMiddleware.js';
import { isConfirmed } from '../middlewares/isConfirmedMiddleware.js';
const router = express.Router();

router.get('/allCases', auth, isConfirmed, getAllCases);
router
    .route('/cases/:caseId')
    .get(auth, isConfirmed, getCaseById)
    .delete(auth, isConfirmed, deleteCase)
    .put(auth,isConfirmed,uploadCoverImage,resizeImg, editCase);
router.post(
    '/addCase',
    auth,
    isConfirmed,
    uploadCoverImage,
    resizeImg,
    addCase
);
export default router;
