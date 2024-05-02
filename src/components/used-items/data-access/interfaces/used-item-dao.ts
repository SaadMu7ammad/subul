import { BookItemRequest, IUsedItem, PlainIUsedItem } from '.';

export interface UsedItemDao {
  addUsedItem: (usedItem: PlainIUsedItem) => Promise<IUsedItem>;
  findAllUsedItems: () => Promise<IUsedItem[]>;
  bookUsedItem: (bookItemData: BookItemRequest) => Promise<IUsedItem | null>;
}
