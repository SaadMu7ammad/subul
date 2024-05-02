import { BookItemRequest, PlainIUsedItem } from '../data-access/interfaces';
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

const bookUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItems = await usedItemRepository.bookUsedItem(bookItemData);
  return usedItems;
};

const cancelBookingOfUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItems = await usedItemRepository.cancelBookingOfUsedItem(
    bookItemData
  );
  return usedItems;
};

const ConfirmBookingReceipt = async (bookItemData: BookItemRequest) => {
  const usedItem = await usedItemRepository.ConfirmBookingReceipt(bookItemData);
  return usedItem;
};

export const usedItemUtils = {
  addUsedItem,
  findAllUsedItems,
  bookUsedItem,
  cancelBookingOfUsedItem,
  ConfirmBookingReceipt,
};
