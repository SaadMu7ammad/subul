import asyncHandler from 'express-async-handler';
import { createPayment } from '../payment/payment.service.js';

const payWithOnlineCard = asyncHandler(async (req, res, next) => {
  let { amount, charityId, caseId, caseTitle } = req.body;
  amount = +amount;
  const { orderId, tokenThirdStep } = await createPayment(
    req.user,
    amount,
    charityId,
    caseId,
    caseTitle,
    process.env.PAYMOB_CREDIT_CARD_INTEGRATION_ID
  );
  return res.status(201).json({
    orderId: orderId,
    data: `https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.PAYMOB_FRAME_ID}?payment_token=${tokenThirdStep}`,
  });
});

export { payWithOnlineCard };
