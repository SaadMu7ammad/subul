import asyncHandler from 'express-async-handler';
import PaymobStrategyOnlineCard from './onlineCards.service.js';

const paymobOnlineCard = new PaymobStrategyOnlineCard();
const payWithOnlineCard = asyncHandler(async (req, res, next) => {
  let { amount } = req.body;
  amount = +amount;
  const { orderId, tokenThirdStep } = await paymobOnlineCard.createPayment(req.user,amount);
  return res.status(201).json({
    paymentId: orderId,
    data: `https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.PAYMOB_FRAME_ID}?payment_token=${tokenThirdStep}`,
  });
});

export { payWithOnlineCard };
