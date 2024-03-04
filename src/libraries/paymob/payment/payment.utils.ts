import { IUser } from '../../../components/user/data-access/interfaces/user.interface';
import { NotFoundError } from '../../errors/components/index';

const checkBeforeCreateLinkForPayment = (
  user:IUser,
  amount:number,
  charityId:string,
  caseId:string,
  caseTitle:string
) => {
  if (!user) throw new NotFoundError('user not found');
  if (!amount || typeof amount !== 'number' || amount <= 0)
    throw new NotFoundError('Invalid amount');
  if (!charityId) throw new NotFoundError('charity not found');
  if (!caseId) throw new NotFoundError('case not found');
  if (!caseTitle) throw new NotFoundError('no complete data entered');
};
export const paymentUtils = {
  checkBeforeCreateLinkForPayment,
};
