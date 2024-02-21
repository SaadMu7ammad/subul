import { createPayment } from '../payment.service.js';
import * as configurationProvider from '../../../configuration-provider/index.js';
const paywithMobileWallet = async (reqBody, user) => {
  const { amount, charityId, caseId, caseTitle }:{amount:number, charityId:string, caseId:string, caseTitle:string} = reqBody;
  const { tokenThirdStep } = await createPayment(
    user,
    +amount,
    charityId,
    caseId,
    caseTitle,
    configurationProvider.getValue('paymob.mobileWalletIntegrationId')
  );
  const request = await fetch(
    ` https://accept.paymob.com/api/acceptance/payments/pay`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_token: tokenThirdStep,
        source: {
          identifier: configurationProvider.getValue(
            'paymob.mobileWalletNumber'
          ), //the wallet number of the user
          subtype: 'WALLET',
        },
      }),
    }
  );
  const response = await request.json();
  return { data: response };
};
export const mobileWalletService = { paywithMobileWallet };
