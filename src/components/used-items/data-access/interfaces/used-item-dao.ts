import { BookItemRequest, IUsedItem, PlainIUsedItem } from '.';

export interface UsedItemDao {
  addUsedItem: (usedItem: PlainIUsedItem) => Promise<IUsedItem>;
  findAllUsedItems: () => Promise<IUsedItem[]>;
  findAndUpdateToBooked: (
    bookItemData: BookItemRequest
  ) => Promise<IUsedItem | null>;
  findBookedItem: (bookItemData: BookItemRequest) => Promise<IUsedItem | null>;
}
