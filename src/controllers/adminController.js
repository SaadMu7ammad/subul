import fs from 'fs';
import path from 'path';
import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import { BadRequestError } from '../errors/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';
import {
  getPendingCharities,
  confirmingCharity,
  rejectingCharity,
  getConfirmedCharities,
  checkPaymentMethodAvailability,
  confirmingPaymentAccount,
  rejectingPaymentAccount,
  getAllPendingPaymentMethodsRequests,
  getCharityPendingPaymentRequests,
} from '../services/admin.service.js';

const getAllPendingRequestsCharities = asyncHandler(async (req, res, next) => {
  const pendingCharities = await getPendingCharities();
  res.status(200).json(pendingCharities);
});

const getPendingRequestCharityById = asyncHandler(async (req, res, next) => {
  const charity = await getPendingCharities(req.params.id);
  res.status(200).json(charity);
});

const getCharityPaymentsRequestsById = asyncHandler(async (req, res, next) => {
  const paymentRequests = await getCharityPendingPaymentRequests(req.params.id);
  res.status(200).json({...paymentRequests});
});

const getAllRequestsPaymentMethods = asyncHandler(async (req, res, next) => {
  // const paymentRequests = await Charity.find({}, 'paymentMethods _id').select(
  //   '-_id'
  // ); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}

  const bankAccountRequests = await getAllPendingPaymentMethodsRequests('bankAccount');

  const fawryRequests = await getAllPendingPaymentMethodsRequests('fawry');

  const vodafoneCashRequests = await getAllPendingPaymentMethodsRequests('vodafoneCash');

  if (!bankAccountRequests&&!fawryRequests&&!vodafoneCashRequests) throw new BadRequestError('No paymentRequests found');

  res.json({ bankAccountRequests, fawryRequests, vodafoneCashRequests });
});

const confirmCharity = asyncHandler(async (req, res, next) => {
  const charity = await getPendingCharities(req.params.id);

  await confirmingCharity(charity);

  await setupMailSender(
    charity.email,
    'Charity has been confirmed successfully',
    `<h2>after reviewing the charity docs we accept it </h2><h2>now you are ready to help the world with us by start to share cases need help </h2>`
  );

  res
    .status(200)
    .json({ message: 'Charity has been confirmed successfully', charity });
});

const rejectCharity = asyncHandler(async (req, res, next) => {
  const charity = await getPendingCharities(req.params.id);

  await rejectingCharity(charity);
  
  await setupMailSender(
    charity.email,
    'Charity has not been confirmed',
    `<h2>after reviewing the charity docs we reject it </h2>
        <h2>you must upload all the docs mentioned to auth the charity and always keep the quality of uploadings high and clear</h2>`
  );
  res.status(200).json({ message: 'Charity failed to be confirmed', charity });
});

const confirmPaymentAccountRequest= asyncHandler(async (req, res, next) => {
  const charity = await getConfirmedCharities(req.params.id);

  const idx = checkPaymentMethodAvailability(charity,req.body.paymentMethod,req.body.paymentAccountID);
  
  await confirmingPaymentAccount(charity,req.body.paymentMethod,idx)

  await setupMailSender(
    charity.email,
    'Charity payment account has been confirmed successfully',
    `<h2>after reviewing the payment account docs we accept it </h2><h2>now you are ready to help the world with us by start to share cases need help </h2>`
  );

  res
    .status(200)
    .json({ message: 'Charity payment account has been confirmed successfully', charity });
});
const rejectPaymentAccountRequest= asyncHandler(async (req, res, next) => {
  const charity = await getConfirmedCharities(req.params.id);

  const idx = checkPaymentMethodAvailability(charity,req.body.paymentMethod,req.body.paymentAccountID);

  await rejectingPaymentAccount(charity,req.body.paymentMethod,idx);
  
  await setupMailSender(
    charity.email,
    'Charity payment account has been rejected',
    `<h2>after reviewing the payment account docs we reject it </h2><h2>you can re upload the docs again, BeCareful to add correct info</h2>`
  );

  res
    .status(200)
    .json({ message: 'Charity payment account has been rejected successfully', charity });
});
export {
  getAllPendingRequestsCharities,
  confirmCharity,
  rejectCharity,
  getPendingRequestCharityById,
  getCharityPaymentsRequestsById,
  getAllRequestsPaymentMethods,
  confirmPaymentAccountRequest,
  rejectPaymentAccountRequest
};
