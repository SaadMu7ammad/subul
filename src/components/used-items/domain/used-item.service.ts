import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../libraries/errors/components';
import { BookItemRequest, PlainIUsedItem } from '../data-access/interfaces';
import { deleteOldImgs } from "../../../utils/deleteFile";
import { usedItemUtils } from "./used-item.utils";

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

const getUsedItem = async (id:string|undefined) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    const usedItem = await usedItemUtils.getUsedItem(id);

    return{
        usedItem,
        message: 'Used Item Fetched Successfully',
    }
}

const updateUsedItem = async (id:string|undefined, userId:string, usedItemData:Partial<PlainIUsedItem>) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await usedItemUtils.getUsedItem(id);

    //check if the user is the owner of the used item
    usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

    const filteredUsedItemData = usedItemUtils.removeUndefinedAttributesFromUsedItemData(usedItemData);

    //update the used item
    const updatedUsedItem = await usedItemUtils.updateUsedItem(id, filteredUsedItemData);

    return{
        usedItem: updatedUsedItem,
        message:'Used Item Updated Successfully',
    }
}

const deleteUsedItem = async (id:string | undefined, userId:string) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await usedItemUtils.getUsedItem(id);

    //check if the user is the owner of the used item
    usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

    //TODO:check if the usedItem is booked or not

    //delete the used item
    const deletedUsedItem = await usedItemUtils.deleteUsedItem(usedItem.id);

    //Delete the imgs
    deleteOldImgs('usedItemsImages',usedItem.images);

    return{
        usedItem: deletedUsedItem,
        message:'Used Item Deleted Successfully' ,
    }
}

const addUsedItemImages = async (id:string | undefined, userId:string, images:string[]) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await usedItemUtils.getUsedItem(id);

    //check if the user is the owner of the used item
    usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

    //add the images
    const updatedUsedItem = await usedItemUtils.addUsedItemImages(id, images);

    return{
        usedItem: updatedUsedItem,
        message:'Used Item Images Added Successfully',
    }
}

const deleteUsedItemImage = async (id:string | undefined, userId:string, imageName:string) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await usedItemUtils.getUsedItem(id);

    //check if the user is the owner of the used item
    usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

    //delete the image
    const updatedUsedItem = await usedItemUtils.deleteUsedItemImage(id, imageName);

    return{
        usedItem: updatedUsedItem,
        message:'Used Item Image Deleted Successfully',
    }
}
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
