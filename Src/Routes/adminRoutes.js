import express, { Router } from 'express';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import { confirmcharity, getAllCharityPaymentsMethods, getAllPendingRequestsCharities, getCharityPaymentsRequestsById, getPendingRequestCharityById, rejectcharity } from '../Controllers/adminController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/AllRequestsCharities',auth,isAdmin,getAllPendingRequestsCharities)
router.get('/requestCharity/:id',auth,isAdmin,getPendingRequestCharityById)
router.get('/AllRequestsPaymentMethods',auth,isAdmin,getAllCharityPaymentsMethods)
router.get('/requestsPaymentMethods/:id',auth,isAdmin,getCharityPaymentsRequestsById)
router.put('/requestsCharities/:id',auth,isAdmin,confirmcharity)
router.post('/requestsCharities/:id',auth,isAdmin,rejectcharity)

export default router;
