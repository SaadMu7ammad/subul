import express, { Router } from 'express';
import { addCase, getAllCases, getCaseById } from '../Controllers/casesController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/allCases',auth,getAllCases)
router.get('/cases/:id',auth,getCaseById)
router.post('/addCase',auth,addCase)
export default router;
