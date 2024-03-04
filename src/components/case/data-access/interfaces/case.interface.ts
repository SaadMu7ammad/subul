import { Document } from 'mongoose';
import {
  ICharityDocument,
} from '../../../charity/data-access/interfaces/charity.interface';

export type GetAllCasesQueryParams = {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: string;
  mainType?: string;
  subType?: string;
  nestedSubType?: string;
};
export type FilterQueryParams = Pick<
  GetAllCasesQueryParams,
  'mainType' | 'subType' | 'nestedSubType'
>;
export type FilterObj = FilterQueryParams & { charity: string };
export type SortObj = { [key: string]: number };
export type PaginationObj = { page: number; limit: number };

export interface ICaseLocation {
  governorate:
    | 'Alexandria'
    | 'Assiut'
    | 'Aswan'
    | 'Beheira'
    | 'Bani Suef'
    | 'Cairo'
    | 'Daqahliya'
    | 'Damietta'
    | 'Fayyoum'
    | 'Gharbiya'
    | 'Giza'
    | 'Helwan'
    | 'Ismailia'
    | 'Kafr El Sheikh'
    | 'Luxor'
    | 'Marsa Matrouh'
    | 'Minya'
    | 'Monofiya'
    | 'New Valley'
    | 'North Sinai'
    | 'Port Said'
    | 'Qalioubiya'
    | 'Qena'
    | 'Red Sea'
    | 'Sharqiya'
    | 'Sohag'
    | 'South Sinai'
    | 'Suez'
    | 'Tanta';
  city?: string;
}

export interface ICase {
  charity: ICharityDocument['_id'] ;
  title: string;
  description: string;
  mainType:
    | 'Sadaqa'
    | 'Zakah'
    | 'BloodDonation'
    | 'kafarat'
    | 'Adahi'
    | 'Campains'
    | 'UsedProperties';
  coverImage: string;
  location: ICaseLocation[];
  subType:
    | 'Aqeeqa'
    | 'BloodDonation'
    | 'Campains'
    | 'Yameen'
    | 'Fediat Siam'
    | 'Foqaraa'
    | 'Masakeen'
    | 'Gharemat'
    | 'Soqia Maa'
    | 'Health'
    | 'General Support'
    | 'Adahy'
    | 'usedBefore';
  nestedSubType?:
    | 'Wasla'
    | 'Hafr Beer'
    | 'Burns'
    | 'Operations & AssistiveDevices'
    | 'Mini Projects'
    | 'General Support';
  gender?: 'male' | 'female' | 'none';
  finished?: boolean;
  upVotes?: number;
  views?: number;
  dateFinished?: Date | number;
  donationNumbers?: number;
  helpedNumbers: number;
  freezed?: boolean;
  targetDonationAmount: number;
  currentDonationAmount?: number;
  // _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICaseLocationDocument extends ICaseLocation, Document {}
export interface ICaseDocument extends ICase, Document {}
