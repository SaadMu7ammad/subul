import fs from 'fs';
import path from 'path';
import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';
import { BadRequestError } from '../errors/bad-request.js';
import { setupMailSender } from '../utils/mailer.js';
import { deleteFile } from '../utils/deleteFile.js';
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
  if (!paymentRequests) throw new BadRequestError('charity not found');

  res.json(paymentRequests);
});
const getAllCharityPaymentsMethods = asyncHandler(async (req, res, next) => {
  const paymentRequests = await Charity.find({}, 'paymentMethods _id').select(
    '-_id'
  ); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}
  if (!paymentRequests) throw new BadRequestError('No paymentRequests found');

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
    .select('name charityDocs paymentMethods')
    .exec();
  if (!charity) throw new BadRequestError('charity not found');
  charity.isPending = false;
  charity.isConfirmed = true;
  //enable all paymentMethods when first time the charity send the docs
  charity.paymentMethods.bankAccount.map(item => {
    item.enable = true;
  })
  charity.paymentMethods.fawry.map(item => {
    item.enable = true;
  })
  charity.paymentMethods.vodafoneCash.map(item => {
    item.enable = true;
})
  // deleteOldImgs(arr)
  await charity.save();
  await setupMailSender(
    charity.email,
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
    charity.email,
    'Charity has not been confirmed',
    `<h2>after reviewing the charity docs we reject it </h2>
        <h2>you must upload all the docs mentioned to auth the charity and always keep the quality of uploadings high and clear</h2>`
  );
  res.status(200).json({ message: 'Charity failed to be confirmed', charity });
});
const confirmPaymentAccountRequest= asyncHandler(async (req, res, next) => {
  const charity = await Charity.findOne({
    _id: req.params.id,
    $and: [
      { isPending: false },
      { isEnabled: true },
      { isConfirmed: true },
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
  if (req.body.paymentMethod !== 'bankAccount' && req.body.paymentMethod !== 'vodafoneCash' && req.body.paymentMethod !== 'fawry') {
    throw new BadRequestError('Invalid Payment Method type'); 
  } 
  const idx=charity.paymentMethods[req.body.paymentMethod].findIndex(item => item._id == req.body.paymentAccountID)
  if(idx===-1)throw new BadRequestError('not found Payment Method account'); 

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
  const charity = await Charity.findOne({
    _id: req.params.id,
    $and: [
      { isPending: false },
      { isEnabled: true },
      { isConfirmed: true },
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
  if (req.body.paymentMethod !== 'bankAccount' && req.body.paymentMethod !== 'vodafoneCash' && req.body.paymentMethod !== 'fawry') {
    throw new BadRequestError('Invalid Payment Method type'); 
  } 
  const idx=charity.paymentMethods[req.body.paymentMethod].findIndex(item => item._id == req.body.paymentAccountID)
  if(idx===-1)throw new BadRequestError('not found Payment Method account'); 

  if (charity.paymentMethods[req.body.paymentMethod][idx].enable === false) {
    let urlOldImage;
    if (req.body.paymentMethod === 'bankAccount') {
      urlOldImage = charity.paymentMethods[req.body.paymentMethod][idx].docsBank;
    }
    else if (req.body.paymentMethod === 'vodafoneCash') {
      urlOldImage = charity.paymentMethods[req.body.paymentMethod][idx].docsVodafoneCash;
      }
    else if (req.body.paymentMethod === 'fawry') {
      urlOldImage = charity.paymentMethods[req.body.paymentMethod][idx].docsFawry;
    }

    charity.paymentMethods[req.body.paymentMethod].splice(idx, 1); //delete the account
    // url: 'http://localhost:5000/docsCharities/docsBank-name.jpeg';
    if (urlOldImage) {
        // const url = path.join('./uploads/docsCharities', charity.paymentMethods[req.body.paymentMethod][idx].docsFawry[0])
        // console.log(url);
        // deleteFile(url)
        deleteOldImgs(urlOldImage);
    } else {
      throw new BadRequestError('No docs found for that account'); 

    }
  }  else {
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
    .json({ message: 'Charity payment account has been confirmed successfully', charity });
});
export {
  getAllPendingRequestsCharities,
  confirmcharity,
  rejectcharity,
  getPendingRequestCharityById,
  getCharityPaymentsRequestsById,
  getAllCharityPaymentsMethods,
  confirmPaymentAccountRequest,
  rejectPaymentAccountRequest
};
