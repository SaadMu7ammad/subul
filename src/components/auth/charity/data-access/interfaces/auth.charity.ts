import mongoose from 'mongoose';

export interface AuthCharity {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  isEnabled: string;
  isConfirmed: boolean;
  isPending: boolean;
}
export interface AuthCharityObject {
  charity: AuthCharity;
  emailAlert: boolean;
  token: string;
}
export interface CharityObject {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  image: string;
}
