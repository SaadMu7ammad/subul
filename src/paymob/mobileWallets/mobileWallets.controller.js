import asyncHandler from 'express-async-handler';
import {createPayment} from '../payment/payment.service.js'
const paywithMobileWallet = asyncHandler(async (req, res, next) => {
  let { amount, charityId, caseId, caseTitle } = req.body;
  amount = +amount;
  const { tokenThirdStep } = await createPayment(
    req.user,
    amount,
    charityId,
    caseId,
    caseTitle,
    process.env.PAYMOB_MOBILE_WALLET_INTEGRATION_ID
  );
  const request = await fetch(
    ` https://accept.paymob.com/api/acceptance/payments/pay`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_token: tokenThirdStep,
        source: {
          identifier: process.env.PAYMOB_MOBILE_WALLET_NUMBER, //the wallet number of the user
          subtype: 'WALLET',
        },
      }),
    }
  );
  const response = await request.json();
  return res.status(201).json({ data: response });
});

export { paywithMobileWallet };
