import { mobileWalletService } from './mobileWallets.service.js';
const paywithMobileWallet = async (req, res, next) => {
  const { amount, charityId, caseId, caseTitle } = req.body;
  const storedUser = req.user;
  const data = {
    amount,
    charityId,
    caseId,
    caseTitle,
  };
  const payInitResponse = await mobileWalletService.paywithMobileWallet(
    data,
    storedUser
  );
  return {
    data: payInitResponse.data,
  };
};

export { paywithMobileWallet };
