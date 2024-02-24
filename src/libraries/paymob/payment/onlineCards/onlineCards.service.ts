import { createPayment } from '../payment.service.js';
import * as configurationProvider from '../../../configuration-provider/index.js';
import { IPaymentInfoData } from '../payment.interface.js';
import { IUser } from '../../../../components/user/data-access/interfaces/user.interface.js';
const payWithOnlineCard = async (reqBody:IPaymentInfoData, user:IUser) => {
  const { amount, charityId, caseId, caseTitle }:{amount:number, charityId:string, caseId:string, caseTitle:string} = reqBody;
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
