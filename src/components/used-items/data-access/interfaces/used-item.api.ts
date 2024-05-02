import { IUsedItem, PlainIUsedItem } from '.';

export type AddUsedItemRequest = PlainIUsedItem;

export type AddUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};

export type GetAllUsedItemsResponse = {
  usedItems: IUsedItem[];
  message: string;
};

export type BookItemRequest = {
  charity: string;
  itemId: string;
};
