import { IUser } from '.';

export type IUserModified = RecursivePartial<
  Pick<IUser, 'name' | 'email' | 'userLocation' | 'gender' | 'phone'>
>;

export type EditProfile = {
  emailAlert: boolean;
  user: IUserModified;
  message: string;
};

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object | undefined ? RecursivePartial<T[P]> : T[P];
};
