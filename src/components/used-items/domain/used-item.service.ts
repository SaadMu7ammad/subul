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

  return {
    usedItems: usedItems,
    message: 'All Used Items Retrieved Successfully',
  };
};

const bookUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItems = await usedItemUtils.bookUsedItem(bookItemData);

  return {
    usedItems: usedItems,
    message: 'Used Item Booked Successfully',
  };
};

const cancelBookingOfUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItems = await usedItemUtils.cancelBookingOfUsedItem(bookItemData);
  // // If not null and charity is not the same as the one in the request should handle that though
  // if (usedItems && usedItems.charity?.toString() !== bookItemData.charity) {
  //   throw new UnauthenticatedError(
  //     `You are not allowed to cancel the booking of this item, because it is not booked by charity with id: ${bookItemData.charity}`
  //   );
  // }
  return {
    usedItems: usedItems,
    message: 'Used Item Cancelled Successfully',
  };
};

const ConfirmBookingReceipt = async (bookItemData: BookItemRequest) => {
  const usedItem = await usedItemUtils.ConfirmBookingReceipt(bookItemData);
  // // If not null and charity is not the same as the one in the request should handle that though
  // if (usedItem && usedItem.charity?.toString() !== bookItemData.charity) {
  //   throw new UnauthenticatedError(
  //     `You are not allowed to confirm this action, because it is not booked by charity with id: ${bookItemData.charity}`
  //   );
  // }
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
