import { createPayment } from '../payment.service';
import * as configurationProvider from '../../../configuration-provider/index';
import { IPaymentInfoData } from '../payment.interface';
import { User } from '../../../../components/user/data-access/interfaces';
const payWithOnlineCard = async (reqBody:IPaymentInfoData, user:User) => {
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
