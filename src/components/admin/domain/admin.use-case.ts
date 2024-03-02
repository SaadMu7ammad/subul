import { adminService } from './admin.service';

const getAllPendingRequestsCharities = async (req, res, next) => {
  const charities = await adminService.getAllOrOnePendingRequestsCharities();
  return { allPendingCharities: charities.allPendingCharities };
};

const getPendingRequestCharityById = async (req, res, next) => {
  const { id }:{id:string} = req.params;
  const pendingRequestCharityById =
    await adminService.getAllOrOnePendingRequestsCharities(id);
  return { pendingCharity: pendingRequestCharityById.allPendingCharities };
};

const getPendingPaymentRequestsForConfirmedCharityById = async (req, res, next) => {
  const { id } :{id:string}= req.params;
  const paymentRequests = await adminService.getPendingPaymentRequestsForConfirmedCharityById(
    id
  );
  return { CharityPaymentsRequest: paymentRequests.paymentRequestsAccounts };
};

const getAllRequestsPaymentMethodsForConfirmedCharities = async (req, res, next) => {
  const allPaymentAccounts = await adminService.getAllRequestsPaymentMethodsForConfirmedCharities();
  return { allPendingRequestedPaymentAccounts: allPaymentAccounts.allPaymentAccounts };
};

const confirmCharity = async (req, res, next) => {
  const { id }:{id:string} = req.params;
  const confirmedCharity = await adminService.confirmCharity(id);

  return {
    message: confirmedCharity.message,
    charity: confirmedCharity.charity,
  };
};

const rejectCharity = async (req, res, next) => {
  const { id }:{id:string} = req.params;
  const rejectedCharity = await adminService.rejectCharity(id);

  return {
    message: rejectedCharity.message,
    charity: rejectedCharity.charity,
  };
};

const confirmPaymentAccountRequestForConfirmedCharities = async (req, res, next) => {
  const { id }:{id:string} = req.params; //charityId
  const { paymentMethod, paymentAccountID } = req.body;

  const confirmedPaymentAccount =
    await adminService.confirmPaymentAccountRequestForConfirmedCharities(
      id,
      paymentMethod,
      paymentAccountID
    );

  return {
    charity: confirmedPaymentAccount.charity,
    message: confirmedPaymentAccount.message,
  };
};
const rejectPaymentAccountRequestForConfirmedCharities = async (req, res, next) => {
  const { id }:{id:string} = req.params; //charityId
  const { paymentMethod, paymentAccountID }:{paymentMethod:string, paymentAccountID:string} = req.body;
  const rejectedPaymentAccount = await adminService.rejectPaymentAccountRequestForConfirmedCharities(
    id,
    paymentMethod,
    paymentAccountID
  );

  return {
    charity: rejectedPaymentAccount.charity,
    message: rejectedPaymentAccount.message,
  };
};
export const adminUseCase = {
  getAllPendingRequestsCharities,
  getPendingRequestCharityById,
  confirmCharity,
  rejectCharity,
  getAllRequestsPaymentMethodsForConfirmedCharities,
  getPendingPaymentRequestsForConfirmedCharityById,
  confirmPaymentAccountRequestForConfirmedCharities,
  rejectPaymentAccountRequestForConfirmedCharities,
};
