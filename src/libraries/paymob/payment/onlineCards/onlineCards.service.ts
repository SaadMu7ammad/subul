import { IUser } from '@components/user/data-access/interfaces';
import * as configurationProvider from '@libs/configuration-provider/index';
import { IPaymentInfoData } from '@libs/paymob/payment/payment.interface';
import { createPayment } from '@libs/paymob/payment/payment.service';

const payWithOnlineCard = async (reqBody: IPaymentInfoData, user: IUser) => {
  const { amount, charityId, caseId, caseTitle }: IPaymentInfoData = reqBody;
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
