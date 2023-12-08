import express, { Router } from 'express';
import dotenv from 'dotenv/config';
import { CreateAuthenticationRequest, OrderRegistrationAPI, PaymentKeyRequest } from '../paymob/paymob.service.js';
const router = express.Router();

router.post('/auth/tokens', CreateAuthenticationRequest);
router.post('/preOrder', OrderRegistrationAPI);
router.post('/requestKey', PaymentKeyRequest);
export default router;
