import { IUsedItem, PlainIUsedItem } from '.';

export interface UsedItemDao {
  addUsedItem: (usedItem: PlainIUsedItem) => Promise<IUsedItem>;
  findAllUsedItems: () => Promise<IUsedItem[]>;
  bookUsedItem: (usedItemId: string) => Promise<IUsedItem | null>;
}
