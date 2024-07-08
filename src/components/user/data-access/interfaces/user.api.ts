import { IUser, IUserModified } from '.';

export type IUserResponse = {
  emailAlert?: boolean;
  user: Partial<IUser>;
  message?: string;
  token?: string;
};

export type ResetUserResponse = {
  message: string;
};

export type ConfirmResetResponse = {
  message: string;
};

export type ChangePasswordResponse = {
  message: string;
};

export type ActivateAccountResponse = {
  message: string;
};
export type bloodContributionResponse = {
  message: string;
};
export type LogoutUserResponse = {
  message: string;
};

export type getUserProfileDataResponse = {
  user: IUser;
  message: string;
};

export type EditUserProfileResponse = {
  user: IUserModified;
  message: string;
};

export type dataForResetEmail = {
  email: string;
};
export type dataForChangePassword = {
  password: string;
};
export type dataForConfirmResetEmail = {
  email: string;
  token: string;
  password: string;
};
export type dataForActivateAccount = {
  token: string;
};
