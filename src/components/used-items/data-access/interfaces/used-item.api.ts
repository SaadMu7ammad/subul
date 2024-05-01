import { IUsedItem } from '../models/used-item.model';

export type AddUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};
