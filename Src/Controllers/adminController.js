import fs from 'fs';
import path from 'path';
import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import { BadRequestError } from '../errors/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';
const deleteOldImgs = (arr, selector) => {
  
 arr.map( (img) => {
    const oldImagePath = path.join('./uploads/docsCharities', img);
    if (fs.existsSync(oldImagePath)) {
      // Delete the file
      fs.unlinkSync(oldImagePath);
      console.log('Old image deleted successfully.');
    } else {
      console.log('Old image does not exist.');
    }
  });
 arr = [];
};
const getAllPendingRequestsCharities = asyncHandler(async (req, res, next) => {
  const charitiesPending = await Charity.find(
    {
      $and: [
        { isPending: true },
        { isEnabled: true },
        {
          $or: [
            { 'emailVerification.isVerified': true },
            { 'phoneVerification.isVerified': true },
          ],
        },
      ],
    },
    '-paymentMethods._id'
  )
    // .select('name')
    .select(
      '-contactInfo -contactInfo -isConfirmed -phoneVerification -rate -currency -location -donorRequests -createdAt -updatedAt -__v -emailVerification -charityInfo -charityDocs -charityReqDocs -cases -image -email -password -description -totalDonationsIncome -verificationCode -isEnabled -isEnabled -isPending '
    );

  // .exec();
  res.status(200).json(charitiesPending);
});
const getPendingRequestCharityById = asyncHandler(async (req, res, next) => {
  const charity = await Charity.findOne({
    _id: req.params.id,
    $and: [
      { isPending: true },
      { isEnabled: true },
      {
        $or: [
          { 'emailVerification.isVerified': true },
          { 'phoneVerification.isVerified': true },
        ],
      },
    ],
  })
    .select('name paymentMethods')
    .exec();
  if (!charity) throw new BadRequestError('charity not found');
  res.status(200).json(charity);
});
const getCharityPaymentsRequestsById = asyncHandler(async (req, res, next) => {
  const paymentRequests = await Charity.findOne(
    { _id: req.params.id },
    'paymentMethods _id'
  ).select('-_id'); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}
  res.json(paymentRequests);
});
const getAllCharityPaymentsMethods = asyncHandler(async (req, res, next) => {
  const paymentRequests = await Charity.find({}, 'paymentMethods _id').select(
    '-_id'
  ); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}
  res.json(paymentRequests);
});
const confirmcharity = asyncHandler(async (req, res, next) => {
  const charity = await Charity.findOne({
    _id: req.params.id,
    $and: [
      { isPending: true },
      { isEnabled: true },
      {
        $or: [
          { 'emailVerification.isVerified': true },
          { 'phoneVerification.isVerified': true },
        ],
      },
    ],
  })
    .select('name paymentMethods')
    .exec();
  if (!charity) throw new BadRequestError('charity not found');
  charity.isPending = false;
  charity.isConfirmed = true;

  // deleteOldImgs(arr)
  await charity.save();
  await setupMailSender(
    req,
    'Charity has been confirmed successfully',
    `<h2>after reviewing the charity docs we accept it </h2><h2>now you are ready to help the world with us by start to share cases need help </h2>`
  );
  res
    .status(200)
    .json({ message: 'Charity has been confirmed successfully', charity });
});

const rejectcharity = asyncHandler(async (req, res, next) => {
  console.log('reh');
  const charity = await Charity.findOne({
    _id: req.params.id,
    $and: [
      { isPending: true },
      { isEnabled: true },
      {
        $or: [
          { 'emailVerification.isVerified': true },
          { 'phoneVerification.isVerified': true },
        ],
      },
    ],
  });
  if (!charity) throw new BadRequestError('charity not found');
  charity.isPending = false;
  charity.isConfirmed = false;
      deleteOldImgs(charity.charityDocs.docs1)
      deleteOldImgs(charity.charityDocs.docs2)
      deleteOldImgs(charity.charityDocs.docs3)
      deleteOldImgs(charity.charityDocs.docs4)
  
  charity.paymentMethods.bankAccount.map(acc => {
    console.log('loop');
    // acc.docsBank.map(img => {
    //   console.log(img);
      deleteOldImgs(acc.docsBank)
     
      // })
  })
  charity.paymentMethods.fawry.map(acc => {
    console.log('loop');
    // acc.docsBank.map(img => {
    //   console.log(img);
      deleteOldImgs(acc.docsFawry)
      // })
  })
  charity.paymentMethods.vodafoneCash.map(acc => {
    console.log('loop');
  
      deleteOldImgs(acc.docsVodafoneCash)
      // })
    })
  await charity.save();
  await setupMailSender(
    req,
    'Charity has not been confirmed',
    `<h2>after reviewing the charity docs we reject it </h2>
        <h2>you must upload all the docs mentioned to auth the charity and always keep the quality of uploadings high and clear</h2>`
  );
  res.status(200).json({ message: 'Charity failed to be confirmed', charity });
});
export {
  getAllPendingRequestsCharities,
  confirmcharity,
  rejectcharity,
  getPendingRequestCharityById,
  getCharityPaymentsRequestsById,getAllCharityPaymentsMethods
};
