import { IUsedItem, PlainIUsedItem} from '.';

export type AddUsedItemRequest = PlainIUsedItem;

export type AddUsedItemResponse = {
  usedItem: IUsedItem;
  message: string;
};

export type GetUsedItemRequest = {};

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