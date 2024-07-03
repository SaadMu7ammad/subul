import { IUsedItem, PlainIUsedItem } from '.';

export type AddUsedItemRequest = Pick<
  PlainIUsedItem,
  'title' | 'description' | 'category' | 'amount' | 'images' | 'user'
>;

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

// export type GetUsedItemRequest = {};

export type GetUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};

export type DeletedUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};

export type UpdateUsedItemRequest = Partial<PlainIUsedItem>;

export type UpdateUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};

export type AddUsedItemImageRequest = {
  images: string[];
};

export type AddUsedItemImageResponse = {
  usedItem: IUsedItem;
  message: string;
};

export type DeleteUsedItemImageRequest = {
  imageName: string;
};
