import mongoose from 'mongoose';

export type SortObj = {
  [key: string]: 1 | -1;
};

export type GetAllNotificationsQueryParams = {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: string;
  read?: string;
};

export type FilterObj = {
  receiver: {
    receiverType: string;
    receiverId: mongoose.Types.ObjectId;
  };
  read?: boolean;
};

export type PaginationObj = {
  page: number;
  limit: number;
  offset: number;
};

export type ReceiverType = 'Charity' | 'User';

export type ResourceType = 'case' | 'usedItem';
