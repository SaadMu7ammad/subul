import { IUser } from '@components/user/data-access/interfaces';
import * as configurationProvider from '@libs/configuration-provider/index';
import { IPaymentInfoData } from '@libs/paymob/payment/payment.interface';
import { createPayment } from '@libs/paymob/payment/payment.service';

const paywithMobileWallet = async (reqBody: IPaymentInfoData, user: IUser) => {
  const { amount, charityId, caseId, caseTitle } = reqBody;
  const { tokenThirdStep } = await createPayment(
    user,
    +amount,
    charityId,
    caseId,
    caseTitle,
    configurationProvider.getValue('paymob.mobileWalletIntegrationId')
  );
  const request = await fetch(` https://accept.paymob.com/api/acceptance/payments/pay`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payment_token: tokenThirdStep,
      source: {
        identifier: configurationProvider.getValue('paymob.mobileWalletNumber'), //the wallet number of the user
        subtype: 'WALLET',
      },
    }),
  });
  const response = await request.json();
  return { data: response };
};
export const mobileWalletService = { paywithMobileWallet };
