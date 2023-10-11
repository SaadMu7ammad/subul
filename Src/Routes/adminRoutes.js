import express, { Router } from 'express';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import { getAllCharitiesReq } from '../Controllers/adminController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/requestsCharities',auth,isAdmin,getAllCharitiesReq)

export default router;
