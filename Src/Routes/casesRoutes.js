import express, { Router } from 'express';
import { addCase } from '../Controllers/casesController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/addCase',auth,addCase)
export default router;
