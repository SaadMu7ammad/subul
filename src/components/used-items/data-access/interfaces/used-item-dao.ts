import { IUsedItem, PlainIUsedItem } from '.';

export interface UsedItemDao {
  addUsedItem: (usedItem: PlainIUsedItem) => Promise<IUsedItem>;
}
