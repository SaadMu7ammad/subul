import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components';
import { deleteOldImgs } from '../../../utils/deleteFile';
import { isDefined } from '../../../utils/shared';
import { BookItemRequest, IUsedItem, PlainIUsedItem,UpdateUsedItemRequest } from '../data-access/interfaces';
import { UsedItemRepository } from '../data-access/used-item.repository';
import { Request, Response } from 'express';
import { ICharity } from '../../charity/data-access/interfaces';

const usedItemRepository = new UsedItemRepository();



const getUsedItem = async (id: string) => {
  const usedItem = await usedItemRepository.getUsedItem(id);
  if (!usedItem) {
    throw new NotFoundError('No such UsedItem with this ID');
  }
  return usedItem;
};

const validateIdParam = (id: string | undefined): asserts id is string => {
  if (!id) {
    throw new BadRequestError('No id provided');
  }
};

const checkIfUsedItemBelongsToUser = (usedItem: IUsedItem, userId: string) => {
  if (usedItem.user.toString() !== userId) {
    throw new BadRequestError('You are not the owner of this Used Item');
  }
};

const deleteUsedItem = async (id: string) => {
  const deletedUsedItem = await usedItemRepository.deleteUsedItem(id);
  if(!deletedUsedItem){
    throw new NotFoundError('No such UsedItem with this ID');
  }
  return deletedUsedItem;
};

const updateUsedItem = async (id: string, usedItemData: UpdateUsedItemRequest) => {
  const updatedUsedItem = await usedItemRepository.updateUsedItem(
    id,
    usedItemData
  );
  if (!updatedUsedItem) {
    throw new NotFoundError('No such UsedItem with this ID');
  }
  return updatedUsedItem;
};

const addUsedItemImages = async (id: string, images: string[]) => {
  const usedItem = await getUsedItem(id);

  while(usedItem.images.length<5 && images.length>0){
    if(isDefined(images[0])) usedItem.images.push(images[0]);
    images.shift();
  }

  const updatedUsedItem = await usedItem.save();

  //if usedItem.images.length + images.length > 5
  deleteOldImgs('usedItemsImages',images)

  return updatedUsedItem;
}

const deleteUsedItemImage = async (id: string, imageName: string) => {
  const usedItem = await getUsedItem(id);

  const imageIndex = usedItem.images.findIndex((image:string) => image === imageName);
  if (imageIndex === -1) {
    throw new NotFoundError('No such Image with this name');
  }

  const deletedImage = usedItem.images.splice(imageIndex, 1);

  deleteOldImgs('usedItemsImages',deletedImage);

  const updatedUsedItem = await usedItem.save();

  return updatedUsedItem;
}

const removeUndefinedAttributesFromUsedItemData = (usedItemData: Partial<PlainIUsedItem>) => {
  const filteredUsedItemData = Object.fromEntries(
  Object.entries(usedItemData).filter(([key, value]) => value !== undefined)
  );

  return filteredUsedItemData;
}
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
  const usedItem = await usedItemRepository.findAndUpdateToBooked(bookItemData);
  if (!usedItem) throw new BadRequestError('This Item Is Already Booked');
  return usedItem;
};

const cancelBookingOfUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItem = await usedItemRepository.findBookedItem(bookItemData);
  if (!usedItem)
    throw new BadRequestError('This Item Already Cancelled Or Confirmed');
  usedItem.booked = false;
  usedItem.charity = undefined;
  await usedItem.save();

  return usedItem;
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
  getUsedItem,
  validateIdParam,
  checkIfUsedItemBelongsToUser,
  deleteUsedItem,
  updateUsedItem,
  addUsedItemImages,
  deleteUsedItemImage,
  removeUndefinedAttributesFromUsedItemData,
  ConfirmBookingReceipt,
  cancelBookingOfUsedItem,
  bookUsedItem,
  findAllUsedItems,
  createBookItemData
};
