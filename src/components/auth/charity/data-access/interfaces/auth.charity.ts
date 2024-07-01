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

export interface CharityData {
  email: string;
  password: string;
  name: string;
  phone: string;
  contactInfo: string;
  description: string;
  currency: string;
  charityLocation: string;
  charityInfo: string;
  image: string;
}
