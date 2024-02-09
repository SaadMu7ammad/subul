import asyncHandler from 'express-async-handler';
import { createPayment } from '../payment/payment.service.js';
import * as configurationProvider from '../../libraries/configuration-provider/index.js';
const payWithOnlineCard = asyncHandler(async (req, res, next) => {
  let { amount, charityId, caseId, caseTitle } = req.body;
  amount = +amount;
  const { orderId, tokenThirdStep } = await createPayment(
    req.user,
    amount,
    charityId,
    caseId,
    caseTitle,
    configurationProvider.getValue('paymob.creditCardIntegrationId')
  );
  return res.status(201).json({
    orderId: orderId,
    data: `https://accept.paymobsolutions.com/api/acceptance/iframes/${configurationProvider.getValue('paymob.frameId')}?payment_token=${tokenThirdStep}`,
  });
});

export { payWithOnlineCard };
