import fs from 'fs';
import path from 'path';
import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import { BadRequestError } from '../errors/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';
import { deleteFile ,deleteOldImgs} from '../utils/deleteFile.js';
import { checkPaymentMethodAvailability, confirmingCharity, getAllPendingPaymentMethodsRequests, getConfirmedCharities, getPendingCharities, rejectingCharity, rejectingPaymentAccount } from '../services/admin.service.js';

const getAllPendingRequestsCharities = asyncHandler(async (req, res, next) => {
  const pendingCharities = await getPendingCharities();
  res.status(200).json(pendingCharities);
});
const getPendingRequestCharityById = asyncHandler(async (req, res, next) => {
  const charity = await getPendingCharities(req.params.id);
  if (!charity) throw new BadRequestError('charity not found');
  res.status(200).json(charity);
});
const getCharityPaymentsRequestsById = asyncHandler(async (req, res, next) => {
  const paymentRequests = await Charity.findOne(
    { _id: req.params.id },
    'paymentMethods _id'
  ).select('-_id'); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}
  if (!paymentRequests) throw new BadRequestError('charity not found');
  let bankAccount = paymentRequests.paymentMethods.bankAccount.filter(acc => acc.enable === false);
  let fawry = paymentRequests.paymentMethods.fawry.filter(acc => acc.enable === false);
  let vodafoneCash = paymentRequests.paymentMethods.vodafoneCash.filter(acc =>acc.enable === false);
  res.status(200).json({bankAccount,fawry,vodafoneCash});
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

  if (!charity) throw new BadRequestError('charity not found');

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

  if (!charity) throw new BadRequestError('charity not found');

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

  if (!charity) throw new BadRequestError('charity not found');

  const idx = checkPaymentMethodAvailability(charity,req.body.paymentMethod,req.body.paymentAccountID);
  
  if (charity.paymentMethods[req.body.paymentMethod][idx].enable === false) {
    charity.paymentMethods[req.body.paymentMethod][idx].enable = true;
  } else {
    throw new BadRequestError('Already this payment account is enabled'); 
  }

  // console.log(charity.paymentMethods[req.body.paymentMethod][idx]);
  await charity.save();

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

  if (!charity) throw new BadRequestError('charity not found');

  const idx = checkPaymentMethodAvailability(charity,req.body.paymentMethod,req.body.paymentAccountID);

  if (charity.paymentMethods[req.body.paymentMethod][idx].enable === false) {
    rejectingPaymentAccount(charity,req.body.paymentMethod,idx)
  } else {
    throw new BadRequestError('Already this payment account is enabled'); 
  }
 
  // console.log(charity.paymentMethods[req.body.paymentMethod][idx]);
  await charity.save();

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
