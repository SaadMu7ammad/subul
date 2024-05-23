import { ICharity } from '@components/charity/data-access/interfaces';

import { CharityObject } from './auth.charity';

export interface registerCharityResponse {
  charity: CharityObject;
}

export interface AuthCharityResponse {
  charity: ICharity;
  message: string;
  token: string;
  emailAlert: boolean;
}
