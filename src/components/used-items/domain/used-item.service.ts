import { deleteOldImgs } from '@utils/deleteFile';
import { Request } from 'express';

import { BookItemRequest, IUsedItem, PlainIUsedItem } from '../data-access/interfaces';
import { usedItemServiceSkeleton } from '../data-access/interfaces';
import { usedItemUtilsClass } from './used-item.utils';

export class usedItemServiceClass implements usedItemServiceSkeleton {
  usedItemUtilsInstance: usedItemUtilsClass;

  constructor() {
    this.usedItemUtilsInstance = new usedItemUtilsClass();
  }
  async addUsedItem(
    req: Request,
    usedItemData: PlainIUsedItem
  ): Promise<{ usedItem: IUsedItem; message: string }> {
    const usedItem = await this.usedItemUtilsInstance.addUsedItem(usedItemData);
    return {
      usedItem,
      message: req.t('usedItems.addUsedItem'),
    };
  }

  async findAllUsedItems(req: Request): Promise<{ usedItems: IUsedItem[]; message: string }> {
    const usedItems = await this.usedItemUtilsInstance.findAllUsedItems();

    return {
      usedItems: usedItems.usedItems,
      message: req.t('usedItems.retrieveUsedItems'),
    };
  }

  async bookUsedItem(
    req: Request,
    bookItemData: BookItemRequest
  ): Promise<{ usedItem: IUsedItem; message: string }> {
    await this.usedItemUtilsInstance.getUsedItem(bookItemData.itemId); //TODO : Delete this line and separate the logic : find the usedItem first , then book it

    const usedItem = await this.usedItemUtilsInstance.bookUsedItem(req, bookItemData);

    return {
      usedItem: usedItem,
      message: 'Used Item Booked Successfully',
    };
  }

  async cancelBookingOfUsedItem(
    req: Request,
    bookItemData: BookItemRequest
  ): Promise<{ usedItem: IUsedItem; message: string }> {
    const usedItem = await this.usedItemUtilsInstance.cancelBookingOfUsedItem(req, bookItemData);
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
  }

  async ConfirmBookingReceipt(
    req: Request,
    bookItemData: BookItemRequest
  ): Promise<{ usedItem: IUsedItem; message: string }> {
    const usedItem = await this.usedItemUtilsInstance.ConfirmBookingReceipt(req, bookItemData);
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
  }

  async getUsedItem(
    req: Request,
    id: string | undefined
  ): Promise<{ usedItem: IUsedItem; message: string }> {
    //check if the id was sent in the request
    const validate: (id: string | undefined) => asserts id is string =
      this.usedItemUtilsInstance.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    const usedItem = await this.usedItemUtilsInstance.getUsedItem(id);

    return {
      usedItem,
      message: req.t('usedItems.getUsedItem'),
    };
  }

  async updateUsedItem(
    req: Request,
    id: string | undefined,
    userId: string,
    usedItemData: Partial<IUsedItem>
  ): Promise<{ usedItem: IUsedItem; message: string }> {
    //check if the id was sent in the request
    const validate: (id: string | undefined) => asserts id is string =
      this.usedItemUtilsInstance.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await this.usedItemUtilsInstance.getUsedItem(id);

    //check if the user is the owner of the used item
    this.usedItemUtilsInstance.checkIfUsedItemBelongsToUser(req, usedItem, userId);

    //check if the used item is booked or not
    this.usedItemUtilsInstance.isUsedItemBooked(usedItem);

    const filteredUsedItemData =
      this.usedItemUtilsInstance.removeUndefinedAttributesFromUsedItemData(usedItemData);

    //update the used item
    const updatedUsedItem = await this.usedItemUtilsInstance.updateUsedItem(
      id,
      filteredUsedItemData
    );

    return {
      usedItem: updatedUsedItem,
      message: req.t('usedItems.updateUsedItem'),
    };
  }

  async deleteUsedItem(
    req: Request,
    id: string | undefined,
    userId: string
  ): Promise<{ usedItem: IUsedItem; message: string }> {
    //check if the id was sent in the request
    const validate: (id: string | undefined) => asserts id is string =
      this.usedItemUtilsInstance.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await this.usedItemUtilsInstance.getUsedItem(id);

    //check if the user is the owner of the used item
    this.usedItemUtilsInstance.checkIfUsedItemBelongsToUser(req, usedItem, userId);

    //check if the usedItem is booked or not
    this.usedItemUtilsInstance.isUsedItemBooked(usedItem);

    //delete the used item
    const deletedUsedItem = await this.usedItemUtilsInstance.deleteUsedItem(usedItem.id);

    //Delete the imgs
    deleteOldImgs('usedItemsImages', usedItem.images);

    return {
      usedItem: deletedUsedItem,
      message: 'Used Item Deleted Successfully',
    };
  }

  async addUsedItemImages(
    req: Request,
    id: string | undefined,

    userId: string,

    images: string[]
  ): Promise<{ usedItem: IUsedItem; message: string }> {
    //check if the id was sent in the request
    const validate: (id: string | undefined) => asserts id is string =
      this.usedItemUtilsInstance.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await this.usedItemUtilsInstance.getUsedItem(id);

    //check if the user is the owner of the used item
    this.usedItemUtilsInstance.checkIfUsedItemBelongsToUser(req, usedItem, userId);

    //check if the usedItem is booked or not
    this.usedItemUtilsInstance.isUsedItemBooked(usedItem);

    //add the images
    const updatedUsedItem = await this.usedItemUtilsInstance.addUsedItemImages(id, images);

    return {
      usedItem: updatedUsedItem,
      message: 'Used Item Images Added Successfully',
    };
  }

  async deleteUsedItemImage(
    req: Request,
    id: string | undefined,

    userId: string,

    imageName: string
  ): Promise<{ usedItem: IUsedItem; message: string }> {
    //check if the id was sent in the request
    const validate: (id: string | undefined) => asserts id is string =
      this.usedItemUtilsInstance.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await this.usedItemUtilsInstance.getUsedItem(id);

    //check if the user is the owner of the used item
    this.usedItemUtilsInstance.checkIfUsedItemBelongsToUser(req, usedItem, userId);

    //check if the usedItem is booked or not
    this.usedItemUtilsInstance.isUsedItemBooked(usedItem);

    //delete the image
    const updatedUsedItem = await this.usedItemUtilsInstance.deleteUsedItemImage(id, imageName);

    return {
      usedItem: updatedUsedItem,
      message: 'Used Item Image Deleted Successfully',
    };
  }
}
