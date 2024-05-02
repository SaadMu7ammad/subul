import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../libraries/errors/components';
import { BookItemRequest, PlainIUsedItem } from '../data-access/interfaces';
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

const bookUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItems = await usedItemUtils.bookUsedItem(bookItemData);

  if (!usedItems) throw new BadRequestError('This Item Is Already Booked');

  return {
    usedItems: usedItems,
    message: 'Used Item Booked Successfully',
  };
};

const cancelBookingOfUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItems = await usedItemUtils.cancelBookingOfUsedItem(bookItemData);

  if (!usedItems) {
    throw new BadRequestError('This Item Already Cancelled Or Confirmed');
  }

  // If not null and charity is not the same as the one in the request should handle that though
  if (usedItems && usedItems.charity?.toString() !== bookItemData.charity) {
    throw new UnauthenticatedError(
      `You are not allowed to cancel the booking of this item, because it is not booked by charity with id: ${bookItemData.charity}`
    );
  }

  usedItems.booked = false;
  usedItems.charity = undefined;
  await usedItems.save();

  return {
    usedItems: usedItems,
    message: 'Used Item Cancelled Successfully',
  };
};

const ConfirmBookingReceipt = async (bookItemData: BookItemRequest) => {
  const usedItem = await usedItemUtils.ConfirmBookingReceipt(bookItemData);

  if (!usedItem) throw new NotFoundError('Used Item Not Found');

  // If not null and charity is not the same as the one in the request should handle that though
  if (usedItem && usedItem.charity?.toString() !== bookItemData.charity) {
    throw new UnauthenticatedError(
      `You are not allowed to confirm this action, because it is not booked by charity with id: ${bookItemData.charity}`
    );
  }

  usedItem.confirmed = true;
  await usedItem.save();
  return {
    usedItem: usedItem,
    message: 'Used Item Confirmed Successfully',
  };
};

export const usedItemService = {
  addUsedItem,
  findAllUsedItems,
  bookUsedItem,
  cancelBookingOfUsedItem,
  ConfirmBookingReceipt,
};
