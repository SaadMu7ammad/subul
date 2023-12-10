import PaymobStrategyOnlineCard from './onlineCards.service.js';

const paymobOnlineCard = new PaymobStrategyOnlineCard();
const payWithOnlineCard = async (req, res, next) => {
  const { orderId, tokenThirdStep } = await paymobOnlineCard.createPayment();
  return res.status(201).json({
    paymentId: orderId,
    data: `https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.PAYMOB_FRAME_ID}?payment_token=${tokenThirdStep}`,
  });
};

export { payWithOnlineCard };
