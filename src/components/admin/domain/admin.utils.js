import { BadRequestError } from '../../../libraries/errors/components/index.js';
import { deleteOldImgs } from '../../../utils/deleteFile.js';
import { adminRepository } from '../data-access/admin.repository.js';

const getAllPendingPaymentMethodsRequestsForConfirmedCharity = async (
  paymentMethod
) => {
  const paymentMethodRequests =
    await adminRepository.getPendingPaymentAccountByAggregation(paymentMethod);
  return paymentMethodRequests;
};
const confirmingCharity = async (charity) => {
  charity.isPending = false;
  charity.isConfirmed = true;
  //enable all paymentMethods when first time the charity send the docs
  charity.paymentMethods.bankAccount.forEach((item) => {
    item.enable = true;
  });
  charity.paymentMethods.fawry.forEach((item) => {
    item.enable = true;
  });
  charity.paymentMethods.vodafoneCash.forEach((item) => {
    item.enable = true;
  });
  await charity.save();
};

const rejectingCharity = async (charity) => {
  charity.isPending = false;
  charity.isConfirmed = false;

  for (let i = 1; i <= 4; ++i) {
    deleteOldImgs('charityDocs', charity.charityDocs['docs' + i]);
  }
  charity.charityDocs = {};

  const paymentMethods = new Map([
    ['bankAccount', 'docsBank'],
    ['fawry', 'docsFawry'],
    ['vodafoneCash', 'docsVodafoneCash'],
  ]);

  for (let [method, docs] of paymentMethods) {
    charity.paymentMethods[method]?.forEach((acc) => {
      deleteOldImgs('charityDocs', acc[docs]);
    });
    charity.paymentMethods[method] = [];
  }

  await charity.save();
};

const checkPaymentMethodAvailability = (
  charity,
  paymentMethod,
  paymentAccountID
) => {
  if (
    paymentMethod !== 'bankAccount' &&
    paymentMethod !== 'vodafoneCash' &&
    paymentMethod !== 'fawry'
  ) {
    throw new BadRequestError('Invalid Payment Method type');
  }

  const idx = charity.paymentMethods[paymentMethod].findIndex(
    (item) => item._id == paymentAccountID
  );

  if (idx === -1) throw new BadRequestError('not found Payment Method account');

  return idx;
};
const getConfirmedCharities = async (queryObject) => {
  const charities = await adminRepository.findCharitiesByQueryWithOptionalId(
    queryObject,
    'name email paymentMethods'
  );
  if (!charities[0]) throw new BadRequestError('charity not found');
  return charities[0];
};

const confirmingPaymentAccount = async (charity, paymentMethod, idx) => {
  if (charity.paymentMethods[paymentMethod][idx].enable === false) {
    charity.paymentMethods[paymentMethod][idx].enable = true;
  } else {
    throw new BadRequestError('Already this payment account is enabled');
  }
  await charity.save();
};
const rejectingPaymentAccount = async (charity, paymentMethod, idx) => {
  if (charity.paymentMethods[paymentMethod][idx].enable === true)
    throw new BadRequestError('Already this payment account is enabled');

  let urlOldImage;

  if (paymentMethod === 'bankAccount') {
    urlOldImage = charity.paymentMethods[paymentMethod][idx].docsBank;
  } else if (paymentMethod === 'vodafoneCash') {
    urlOldImage = charity.paymentMethods[paymentMethod][idx].docsVodafoneCash;
  } else if (paymentMethod === 'fawry') {
    urlOldImage = charity.paymentMethods[paymentMethod][idx].docsFawry;
  }

  charity.paymentMethods[paymentMethod].splice(idx, 1); //delete the account
  // url: 'http://localhost:5000/charityDocs/docsBank-name.jpeg';
  // const url = path.join('./uploads/charityDocs', charity.paymentMethods[paymentMethod][idx].docsFawry[0])
  if (urlOldImage) {
    deleteOldImgs('charityDocs', urlOldImage);
  } else {
    throw new BadRequestError('No docs found for that account');
  }

  await charity.save();
};
export const adminUtils = {
  getAllPendingPaymentMethodsRequestsForConfirmedCharity,
  confirmingCharity,
  rejectingCharity,
  checkPaymentMethodAvailability,
  getConfirmedCharities,
  confirmingPaymentAccount,
  rejectingPaymentAccount,
};
