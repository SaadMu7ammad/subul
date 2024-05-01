import { PlainIUsedItem } from '../data-access/interfaces';
import { UsedItemRepository } from '../data-access/used-item.repository';

const usedItemRepository = new UsedItemRepository();

const addUsedItem = async (usedItemData: PlainIUsedItem) => {
  const usedItem = await usedItemRepository.addUsedItem(usedItemData);
  return usedItem;
};

const findAllUsedItems = async () => {
  const usedItems = await usedItemRepository.findAllUsedItems();
  return usedItems;
};

export const usedItemUtils = {
  addUsedItem,
  findAllUsedItems,
};
