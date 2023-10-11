import express, { Router } from 'express';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import { confirmcharity, getAllCharitiesReq, getCharityById, rejectcharity } from '../Controllers/adminController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/requestsCharities',auth,isAdmin,getAllCharitiesReq)
router.get('/requestsCharities/:id',auth,isAdmin,getCharityById)
router.put('/requestsCharities/:id',auth,isAdmin,confirmcharity)
router.post('/requestsCharities/:id',auth,isAdmin,rejectcharity)

export default router;
