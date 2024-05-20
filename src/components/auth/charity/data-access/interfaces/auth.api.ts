import { AuthCharity, CharityObject } from './auth.charity';

export interface registerCharityResponse {
  charity: CharityObject;
}

export interface AuthCharityResponse {
  charity: AuthCharity;
  message: string;
  token: string;
  emailAlert: boolean;
}
