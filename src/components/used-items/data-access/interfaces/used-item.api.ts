import { IUsedItem, PlainIUsedItem} from '.';

export type AddUsedItemRequest = PlainIUsedItem;

export type AddUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};

export type DeletedUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};

export type GetUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};