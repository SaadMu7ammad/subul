import { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components';
import { ICharity } from '../../charity/data-access/interfaces';
import { BookItemRequest, PlainIUsedItem } from '../data-access/interfaces';
import { UsedItemRepository } from '../data-access/used-item.repository';

const usedItemRepository = new UsedItemRepository();

const addUsedItem = async (usedItemData: PlainIUsedItem) => {
  const usedItem = await usedItemRepository.addUsedItem(usedItemData);
  return usedItem;
};

const findAllUsedItems = async () => {
  const usedItems = await usedItemRepository.findAllUsedItems();
  if (!usedItems.length) {
    return {
      usedItems: usedItems,
      message: 'No Used Items Found',
    };
  }
  return usedItems;
};

const createBookItemData = async (
  req: Request,
  res: Response
): Promise<BookItemRequest> => {
  const charity: ICharity = res.locals.charity;
  const { id: itemId } = req.params;

  if (!itemId) throw new NotFoundError('Used Item Id Not Found');
  return {
    charity: charity._id.toString(),
    itemId,
  };
};

const bookUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItems = await usedItemRepository.findAndUpdateToBooked(
    bookItemData
  );
  if (!usedItems) throw new BadRequestError('This Item Is Already Booked');
  return usedItems;
};

const cancelBookingOfUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItems = await usedItemRepository.findBookedItem(bookItemData);
  if (!usedItems)
    throw new BadRequestError('This Item Already Cancelled Or Confirmed');
  usedItems.booked = false;
  usedItems.charity = undefined;
  await usedItems.save();

  return usedItems;
};

const ConfirmBookingReceipt = async (bookItemData: BookItemRequest) => {
  const usedItem = await usedItemRepository.findBookedItem(bookItemData);
  if (!usedItem) throw new NotFoundError('Used Item Not Found');
  usedItem.confirmed = true;
  await usedItem.save();

  return usedItem;
};

export const usedItemUtils = {
  addUsedItem,
  findAllUsedItems,
  createBookItemData,
  bookUsedItem,
  cancelBookingOfUsedItem,
  ConfirmBookingReceipt,
};
