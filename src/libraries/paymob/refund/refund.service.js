import { getTransactionByIdService } from '../admin/getTransactionById.service.js';
import {
  BadRequestError,
  NotFoundError,
} from '../../errors/components/index.js';
import Transaction from '../../../components/transaction/data-access/models/transactionModel.js';
const refund = async (transaction_id) => {
  const stepOneToken = await getTransactionByIdService.getTokenStepOne();
  if (!stepOneToken) throw new NotFoundError('no token provided');
  const data = await getTransactionByIdService.getTransactionInfo(
    stepOneToken,
    transaction_id
  );
  if (!data) throw new NotFoundError('no transaction found');
  const { id, amount_cents, success, pending } = data;
  const orderId = data.order.id;
  //a solution indexing for the transaction table on externalTransactionId
  const transactionIsExist = await Transaction.findOne({
    externalTransactionId: transaction_id,
  });
  console.log('transaction in refund service');
  if (!transactionIsExist)
    throw new NotFoundError('transaction not stored in db');

  if (orderId.toString() !== transactionIsExist.orderId) {
    throw new BadRequestError('conflict in the order id !');
  }
  if (amount_cents !== transactionIsExist.moneyPaid * 100) {
    throw new BadRequestError('conflict in the transaction amount paid !');
  }
  if (transactionIsExist.status === 'refunded') {
    throw new BadRequestError('status is already refunded ');
  }
  if (
    transactionIsExist.status !== 'success' ||
    success !== true ||
    pending === true
  ) {
    throw new BadRequestError('status is not succedded or still pending ');
  }
  if (success !== true || pending === true) {
    throw new BadRequestError(
      'the transaction is not succedded ..cant refund it'
    );
  }
  const request = await fetch(
    'https://accept.paymob.com/api/acceptance/void_refund/refund',
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: stepOneToken,
        transaction_id: id,
        amount_cents: amount_cents,
      }),
    }
  );
  const response = await request.json();
  if (response) {
    transactionIsExist.externalTransactionId = response.id;
    await transactionIsExist.save();
  } else {
    throw new BadRequestError('refund not completed');
  }
  // const reTransactionIsExist = await Transaction.findOne({
  //   externalTransactionId: transaction_id,
  // });
  // //update the external id for the db transation
  // console.log('update tranaction idddd');
  // reTransactionIsExist.externalTransactionId = response.id;
  // await reTransactionIsExist.save()
  // console.log({ status: reTransactionIsExist.status, data: reTransactionIsExist });
  return response;
};

export const refundService = { refund };
