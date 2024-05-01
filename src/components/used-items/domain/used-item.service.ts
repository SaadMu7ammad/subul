import { PlainIUsedItem } from '../data-access/interfaces';
import { usedItemUtils } from './used-item.utils';

const addUsedItem = async (usedItemData: PlainIUsedItem) => {
  const usedItem = await usedItemUtils.addUsedItem(usedItemData);

  return {
    usedItem,
    message: 'Used Item Created Successfully',
  };
};

const findAllUsedItems = async () => {
  const usedItems = await usedItemUtils.findAllUsedItems();
  if (!usedItems.length) {
    return {
      usedItems: usedItems,
      message: 'No Used Items Found',
    };
  }

  return {
    usedItems: usedItems,
    message: 'All Used Items Retrieved Successfully',
  };
};

export const usedItemService = {
  addUsedItem,
  findAllUsedItems,
};
