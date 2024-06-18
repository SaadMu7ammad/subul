import { BookItemRequest, PlainIUsedItem } from '@components/used-items/data-access/interfaces';
import { deleteOldImgs } from '@utils/deleteFile';

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
  await usedItemUtils.getUsedItem(bookItemData.itemId); //TODO : Delete this line and separate the logic : find the usedItem first , then book it

  const usedItem = await usedItemUtils.bookUsedItem(bookItemData);

  return {
    usedItem: usedItem,
    message: 'Used Item Booked Successfully',
  };
};

const cancelBookingOfUsedItem = async (bookItemData: BookItemRequest) => {
  const usedItem = await usedItemUtils.cancelBookingOfUsedItem(bookItemData);
  // // If not null and charity is not the same as the one in the request should handle that though
  // if (usedItems && usedItems.charity?.toString() !== bookItemData.charity) {
  //   throw new UnauthenticatedError(
  //     `You are not allowed to cancel the booking of this item, because it is not booked by charity with id: ${bookItemData.charity}`
  //   );
  // }
  return {
    usedItem: usedItem,
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

const getUsedItem = async (id: string | undefined) => {
  //check if the id was sent in the request
  const validate: (id: string | undefined) => asserts id is string = usedItemUtils.validateIdParam;
  validate(id); //it gives an error if I executed the function directly 🤕

  const usedItem = await usedItemUtils.getUsedItem(id);

  return {
    usedItem,
    message: 'Used Item Fetched Successfully',
  };
};

const updateUsedItem = async (
  id: string | undefined,
  userId: string,
  usedItemData: Partial<PlainIUsedItem>
) => {
  //check if the id was sent in the request
  const validate: (id: string | undefined) => asserts id is string = usedItemUtils.validateIdParam;
  validate(id); //it gives an error if I executed the function directly 🤕

  //check if the used item exists
  const usedItem = await usedItemUtils.getUsedItem(id);

  //check if the user is the owner of the used item
  usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

  //check if the used item is booked or not
  usedItemUtils.isUsedItemBooked(usedItem);

  const filteredUsedItemData =
    usedItemUtils.removeUndefinedAttributesFromUsedItemData(usedItemData);

  //update the used item
  const updatedUsedItem = await usedItemUtils.updateUsedItem(id, filteredUsedItemData);

  return {
    usedItem: updatedUsedItem,
    message: 'Used Item Updated Successfully',
  };
};

const deleteUsedItem = async (id: string | undefined, userId: string) => {
  //check if the id was sent in the request
  const validate: (id: string | undefined) => asserts id is string = usedItemUtils.validateIdParam;
  validate(id); //it gives an error if I executed the function directly 🤕

  //check if the used item exists
  const usedItem = await usedItemUtils.getUsedItem(id);

  //check if the user is the owner of the used item
  usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

  //check if the usedItem is booked or not
  usedItemUtils.isUsedItemBooked(usedItem);

  //delete the used item
  const deletedUsedItem = await usedItemUtils.deleteUsedItem(usedItem.id);

  //Delete the imgs
  deleteOldImgs('usedItemsImages', usedItem.images);

  return {
    usedItem: deletedUsedItem,
    message: 'Used Item Deleted Successfully',
  };
};

const addUsedItemImages = async (id: string | undefined, userId: string, images: string[]) => {
  //check if the id was sent in the request
  const validate: (id: string | undefined) => asserts id is string = usedItemUtils.validateIdParam;
  validate(id); //it gives an error if I executed the function directly 🤕

  //check if the used item exists
  const usedItem = await usedItemUtils.getUsedItem(id);

  //check if the user is the owner of the used item
  usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

  //check if the usedItem is booked or not
  usedItemUtils.isUsedItemBooked(usedItem);

  //add the images
  const updatedUsedItem = await usedItemUtils.addUsedItemImages(id, images);

  return {
    usedItem: updatedUsedItem,
    message: 'Used Item Images Added Successfully',
  };
};

const deleteUsedItemImage = async (id: string | undefined, userId: string, imageName: string) => {
  //check if the id was sent in the request
  const validate: (id: string | undefined) => asserts id is string = usedItemUtils.validateIdParam;
  validate(id); //it gives an error if I executed the function directly 🤕

  //check if the used item exists
  const usedItem = await usedItemUtils.getUsedItem(id);

  //check if the user is the owner of the used item
  usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

  //check if the usedItem is booked or not
  usedItemUtils.isUsedItemBooked(usedItem);

  //delete the image
  const updatedUsedItem = await usedItemUtils.deleteUsedItemImage(id, imageName);

  return {
    usedItem: updatedUsedItem,
    message: 'Used Item Image Deleted Successfully',
  };
};

export const usedItemService = {
  addUsedItem,
  findAllUsedItems,
  bookUsedItem,
  cancelBookingOfUsedItem,
  ConfirmBookingReceipt,
  deleteUsedItem,
  getUsedItem,
  updateUsedItem,
  addUsedItemImages,
  deleteUsedItemImage,
};
