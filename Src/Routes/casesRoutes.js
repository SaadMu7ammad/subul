import express, { Router } from 'express';
import {
    addCase,
    deleteCase,
    getAllCases,
    getCaseById,
} from '../Controllers/casesController.js';
import { auth } from '../middlewares/authMiddleware.js';
import { uploadCoverImage, resizeImg } from '../middlewares/imageMiddleware.js';
const router = express.Router();

router.get('/allCases', auth, getAllCases);
router.route('/cases/:caseId').get(auth, getCaseById).delete(auth,deleteCase);
router.post('/addCase', uploadCoverImage, resizeImg, auth, addCase);
export default router;
