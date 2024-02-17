import { createPayment } from '../index/payment.service.js';
import * as configurationProvider from '../../../configuration-provider/index.js';
const payWithOnlineCard = async (reqBody, user) => {
  const { amount, charityId, caseId, caseTitle } = reqBody;
  const { orderId, tokenThirdStep } = await createPayment(
    user,
    +amount,
    charityId,
    caseId,
    caseTitle,
    configurationProvider.getValue('paymob.creditCardIntegrationId')
  );
  return {
    orderId: orderId,
    data: `https://accept.paymobsolutions.com/api/acceptance/iframes/${configurationProvider.getValue(
      'paymob.frameId'
    )}?payment_token=${tokenThirdStep}`,
  };
};

export const OnlineCardService = { payWithOnlineCard };
