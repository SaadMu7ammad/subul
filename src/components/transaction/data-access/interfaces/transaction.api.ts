import { ITransaction } from '.';

export type GetAllTransactionResponse = {
  status: string;
  data: {
    allTransactions: (ITransaction | null)[];
  };
};

export type UpdateCaseInfoResponse = {
  status: string;
  data: ITransaction;
};