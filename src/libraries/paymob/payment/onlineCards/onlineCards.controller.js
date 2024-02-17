import { OnlineCardService } from './onlineCards.service.js';
const payWithOnlineCard = async (req, res, next) => {
  const { amount, charityId, caseId, caseTitle } = req.body;
  const storedUser = req.user;
  const data = {
    amount,
    charityId,
    caseId,
    caseTitle,
  };
  const payInitResponse = await OnlineCardService.payWithOnlineCard(data, storedUser);

  return {
    orderId: payInitResponse.orderId,
    data: payInitResponse.data,
  };
};

export { payWithOnlineCard };