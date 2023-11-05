import express, { Router } from 'express';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import { confirmcharity,confirmPaymentAccountRequest, getAllCharityPaymentsMethods, getAllPendingRequestsCharities, getCharityPaymentsRequestsById, getPendingRequestCharityById, rejectcharity, rejectPaymentAccountRequest } from '../Controllers/adminController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/AllRequestsCharities',auth,isAdmin,getAllPendingRequestsCharities)
router.get('/requestCharity/:id',auth,isAdmin,getPendingRequestCharityById)
router.get('/AllRequestsPaymentMethods',auth,isAdmin,getAllCharityPaymentsMethods)
router.get('/requestsPaymentMethods/:id',auth,isAdmin,getCharityPaymentsRequestsById)
router.put('/confirmrequestsCharities/:id',auth,isAdmin,confirmcharity)
router.put('/rejectrequestsCharities/:id',auth,isAdmin,rejectcharity)
router.put('/confirmrequestPaymentMethod/:id',auth,isAdmin,confirmPaymentAccountRequest)
router.put('/rejectrequestPaymentMethod/:id',auth,isAdmin,rejectPaymentAccountRequest)

export default router;
