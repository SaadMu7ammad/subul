import { IUsedItem, PlainIUsedItem} from '.';

export type AddUsedItemRequest = PlainIUsedItem;

export type AddUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};
