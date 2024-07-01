import { IUser } from '@components/user/data-access/interfaces';

import { UserObject } from './auth.user';

export interface authUserResponse {
  user: IUser;
  msg?: string;
  token?: string; // must be optional cuz it comes from responseData as optional
  isVerified: boolean;
}

export interface registerUserResponse {
  user: UserObject;
}
