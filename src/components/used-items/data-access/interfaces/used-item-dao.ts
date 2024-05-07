import { BookItemRequest, IUsedItem, PlainIUsedItem } from '.';

export interface UsedItemDao {
  findAllUsedItems: () => Promise<IUsedItem[]>;
  bookUsedItem: (bookItemData: BookItemRequest) => Promise<IUsedItem | null>;
  addUsedItem: (usedItem: PlainIUsedItem) => Promise<IUsedItem>;
  getUsedItem: (id: string) => Promise<IUsedItem | null>;
  deleteUsedItem: (id: string) => Promise<IUsedItem | null>;
  updateUsedItem: (id: string, usedItem: PlainIUsedItem) => Promise<IUsedItem | null>;
}
