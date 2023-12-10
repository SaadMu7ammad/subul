import PaymobStrategyMobileWallet from './mobileWallets.service.js';

const paymobMobileWallet = new PaymobStrategyMobileWallet();
const paywithMobileWallet = async (req, res, next) => {
  const { tokenThirdStep } = await paymobMobileWallet.createPayment();
  const request = await fetch(
    ` https://accept.paymob.com/api/acceptance/payments/pay`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_token: tokenThirdStep,
        source: {
          identifier: process.env.PAYMOB_MOBILE_WALLET_NUMBER,
          subtype: 'WALLET',
        },
      }),
    }
  );
  const response = await request.json();
  return res.status(201).json({ data: response });
};

export { paywithMobileWallet };
