import express, { Router } from 'express';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import { confirmcharity, getAllCharityPaymentsMethods, getCharityPendingRequestsById, getCharityPaymentsRequestsById, rejectcharity } from '../Controllers/adminController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/requestsCharities',auth,isAdmin,getAllCharityPaymentsMethods)
router.get('/requestsCharitiesPayments/:id',auth,isAdmin,getCharityPaymentsRequestsById)
router.get('/requestsCharities/:id',auth,isAdmin,getCharityPendingRequestsById)
// router.get('/requestsCharitiesPayments',auth,isAdmin,getAllCharityPaymentsMethods)
router.put('/requestsCharities/:id',auth,isAdmin,confirmcharity)
router.post('/requestsCharities/:id',auth,isAdmin,rejectcharity)

export default router;
