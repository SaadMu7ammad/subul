import express, { Router } from 'express';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import { confirmCharity,confirmPaymentAccountRequest, getAllRequestsPaymentMethods, getAllPendingRequestsCharities, getCharityPaymentsRequestsById, getPendingRequestCharityById, rejectCharity, rejectPaymentAccountRequest } from '../Controllers/adminController.js';
import { auth } from '../middlewares/authMiddleware.js';
import { getTransactionById } from '../paymob/admin/getTransactionById.controller.js';
import { refund } from '../paymob/Refund/refund.controller.js';

const router = express.Router();
router.get('/AllRequestsCharities',auth,isAdmin,getAllPendingRequestsCharities)
router.get('/requestCharity/:id',auth,isAdmin,getPendingRequestCharityById)
router.get('/AllRequestsPaymentMethods',auth,isAdmin,getAllRequestsPaymentMethods)
router.get('/requestsPaymentMethods/:id',auth,isAdmin,getCharityPaymentsRequestsById)
router.put('/confirmrequestsCharities/:id',auth,isAdmin,confirmCharity)
router.put('/rejectrequestsCharities/:id',auth,isAdmin,rejectCharity)
router.put('/confirmrequestPaymentMethod/:id',auth,isAdmin,confirmPaymentAccountRequest)
router.put('/rejectrequestPaymentMethod/:id',auth,isAdmin,rejectPaymentAccountRequest)

router.get('/paymob/getTransactionById/:id',auth,isAdmin,getTransactionById)
router.post('/paymob/refund/:id',auth,isAdmin,refund)
export default router;
