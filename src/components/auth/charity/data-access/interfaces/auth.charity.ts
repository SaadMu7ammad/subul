import { ICharity } from '@components/charity/data-access/interfaces';
import mongoose from 'mongoose';

export interface AuthCharityObject {
  charity: ICharity;
  emailAlert: boolean;
  token: string;
}
export interface CharityObject {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  image: string;
}
