import { BadRequestError } from '../../../libraries/errors/components';
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

const bookUsedItem = async (usedItemId: string) => {
  const usedItems = await usedItemUtils.bookUsedItem(usedItemId);

  if (!usedItems) throw new BadRequestError('This Item Is Already Booked');

  return {
    usedItems: usedItems,
    message: 'Used Items Booked Successfully',
  };
};

export const usedItemService = {
  addUsedItem,
  findAllUsedItems,
  bookUsedItem,
};
