import asyncHandler from 'express-async-handler';
import Charity from '../models/charityModel.js';

const getAllCharitiesReq = asyncHandler(async (req, res, next) => {
  const charitiesPending = await Charity.find({
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
  }).select('name');

  res.status(200).json(charitiesPending);
});

export { getAllCharitiesReq };
