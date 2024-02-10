import { adminService } from './admin.service.js';

const getAllPendingRequestsCharities = async (req, res, next) => {
  const charities = await adminService.getAllOrOnePendingRequestsCharities();
  return { allPendingCharities: charities.allPendingCharities };
};

const getPendingRequestCharityById = async (req, res, next) => {
  const { id } = req.params;
  const pendingRequestCharityById =
    await adminService.getAllOrOnePendingRequestsCharities(id);
  return { pendingCharity: pendingRequestCharityById.allPendingCharities };
};

const getPendingPaymentRequestsForConfirmedCharityById = async (req, res, next) => {
  const { id } = req.params;
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
  const { id } = req.params;
  const charityConfirmed = await adminService.confirmCharity(id);

  return {
    message: charityConfirmed.message,
    charity: charityConfirmed.charity,
  };
};

const rejectCharity = async (req, res, next) => {
  const { id } = req.params;
  const charityRejected = await adminService.rejectCharity(id);

  return {
    message: charityRejected.message,
    charity: charityRejected.charity,
  };
};

const confirmPaymentAccountRequestForConfirmedCharities = async (req, res, next) => {
  const { id } = req.params; //charityId
  const { paymentMethod, paymentAccountID } = req.body;

  const paymentAccountConfirmed =
    await adminService.confirmPaymentAccountRequestForConfirmedCharities(
      id,
      paymentMethod,
      paymentAccountID
    );

  return {
    charity: paymentAccountConfirmed.charity,
    message: paymentAccountConfirmed.message,
  };
};
const rejectPaymentAccountRequestForConfirmedCharities = async (req, res, next) => {
  const { id } = req.params; //charityId
  const { paymentMethod, paymentAccountID } = req.body;
  const paymentAccountRejected = await adminService.rejectPaymentAccountRequestForConfirmedCharities(
    id,
    paymentMethod,
    paymentAccountID
  );

  return {
    charity: paymentAccountRejected.charity,
    message: paymentAccountRejected.message,
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
