import { ICharity } from '@components/charity/data-access/interfaces';
import {
  BookItemRequest,
  IUsedItem,
  PlainIUsedItem,
  UpdateUsedItemRequest,
  usedItemUtilsSkeleton,
} from '@components/used-items/data-access/interfaces';
import { BadRequestError, NotFoundError } from '@libs/errors/components';
import { deleteOldImgs } from '@utils/deleteFile';
import { notificationManager } from '@utils/sendNotification';
import { isDefined } from '@utils/shared';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { USED_ITEM } from './used-item.class';

export class usedItemUtilsClass implements usedItemUtilsSkeleton {
  usedItemInstance: USED_ITEM;
  notificationInstance: notificationManager;
  constructor() {
    this.notificationInstance = new notificationManager();
    this.usedItemInstance = new USED_ITEM();
  }

  async getUsedItem(id: string): Promise<IUsedItem> {
    const usedItem = await this.usedItemInstance.usedItemdModel.getUsedItem(id);
    if (!usedItem) {
      throw new NotFoundError('No such UsedItem with this ID');
    }
    return usedItem;
  }

  validateIdParam(id: string | undefined): asserts id is string {
    if (!id) {
      throw new BadRequestError('No id provided');
    }
  }

  checkIfUsedItemBelongsToUser(usedItem: IUsedItem, userId: string): void {
    if (usedItem.user.toString() !== userId) {
      throw new BadRequestError('You are not the owner of this Used Item');
    }
  }

  async deleteUsedItem(id: string): Promise<IUsedItem> {
    const deletedUsedItem = await this.usedItemInstance.usedItemdModel.deleteUsedItem(id);
    if (!deletedUsedItem) {
      throw new NotFoundError('No such UsedItem with this ID');
    }
    return deletedUsedItem;
  }

  async updateUsedItem(id: string, usedItemData: UpdateUsedItemRequest): Promise<IUsedItem> {
    const updatedUsedItem = await this.usedItemInstance.usedItemdModel.updateUsedItem(
      id,
      usedItemData
    );
    if (!updatedUsedItem) {
      throw new NotFoundError('No such UsedItem with this ID');
    }
    return updatedUsedItem;
  }

  async addUsedItemImages(id: string, images: string[]): Promise<IUsedItem> {
    const usedItem = await this.getUsedItem(id);

    while (usedItem.images.length < 5 && images.length > 0) {
      if (isDefined(images[0])) usedItem.images.push(images[0]);
      images.shift();
    }

    const updatedUsedItem = await usedItem.save();

    //if usedItem.images.length + images.length > 5
    deleteOldImgs('usedItemsImages', images);

    return updatedUsedItem;
  }

  async deleteUsedItemImage(id: string, imageName: string): Promise<IUsedItem> {
    const usedItem = await this.getUsedItem(id);

    const imageIndex = usedItem.images.findIndex((image: string) => image === imageName);
    if (imageIndex === -1) {
      throw new NotFoundError('No such Image with this name');
    }

    const deletedImage = usedItem.images.splice(imageIndex, 1);

    deleteOldImgs('usedItemsImages', deletedImage);

    const updatedUsedItem = await usedItem.save();

    return updatedUsedItem;
  }

  removeUndefinedAttributesFromUsedItemData(usedItemData: Partial<PlainIUsedItem>): {
    [k: string]: string | number | boolean | Types.ObjectId | string[];
  } {
    const filteredUsedItemData = Object.fromEntries(
      Object.entries(usedItemData).filter(([key, value]) => value !== undefined)
    );

    return filteredUsedItemData;
  }
  async addUsedItem(usedItemData: PlainIUsedItem): Promise<IUsedItem> {
    const usedItem = await this.usedItemInstance.usedItemdModel.addUsedItem(usedItemData);
    return usedItem;
  }

  async findAllUsedItems(): Promise<{ usedItems: IUsedItem[]; message?: string }> {
    const usedItems = await this.usedItemInstance.usedItemdModel.findAllUsedItems();
    if (!usedItems.length) {
      return {
        usedItems: usedItems,
        message: 'No Used Items Found',
      };
    }
    return { usedItems: usedItems };
  }

  async createBookItemData(req: Request, res: Response): Promise<BookItemRequest> {
    const charity: ICharity = res.locals.charity;
    const { id: itemId } = req.params;

    if (!itemId) throw new NotFoundError('Used Item Id Not Found');
    return {
      charity: charity._id.toString(),
      itemId,
    };
  }

  async bookUsedItem(bookItemData: BookItemRequest): Promise<IUsedItem> {
    const usedItem = await this.usedItemInstance.usedItemdModel.findAndUpdateToBooked(bookItemData);

    if (!usedItem) throw new BadRequestError('This Item Is Already Booked');

    await this.notifyUserAboutUsedItemBooking(usedItem, 'booking');

    return usedItem;
  }

  async cancelBookingOfUsedItem(bookItemData: BookItemRequest): Promise<IUsedItem> {
    const usedItem = await this.usedItemInstance.usedItemdModel.findBookedItem(bookItemData);
    if (!usedItem) throw new BadRequestError('This Item Already Cancelled Or Confirmed');

    // TODO : this should be after saving the usedItem , don't notify the user if something wrong happened and the used Item is not saved
    await this.notifyUserAboutUsedItemBooking(
      usedItem,
      'bookingCancelation',
      3 * 24 * 60 * 60 * 1000
    );

    usedItem.booked = false;
    usedItem.charity = undefined;

    await usedItem.save();

    return usedItem;
  }

  async ConfirmBookingReceipt(bookItemData: BookItemRequest): Promise<IUsedItem> {
    const usedItem = await this.usedItemInstance.usedItemdModel.findBookedItem(bookItemData);
    if (!usedItem) throw new NotFoundError('Used Item Not Found');
    usedItem.confirmed = true;
    await usedItem.save();

    await this.notifyUserAboutUsedItemBooking(usedItem, 'bookingConfirmation');

    return usedItem;
  }

  isUsedItemBooked(usedItem: IUsedItem): void {
    if (usedItem.booked) {
      throw new BadRequestError('This Used Item is already booked');
    }
  }

  async notifyUserAboutUsedItemBooking(
    usedItem: IUsedItem,
    notificationType: 'booking' | 'bookingConfirmation' | 'bookingCancelation',
    maxAge: number | undefined = undefined
  ): Promise<void> {
    if (notificationType !== 'bookingCancelation' && !usedItem.charity)
      throw new BadRequestError('Item is not booked by any charity yet');

    await usedItem.populate<{ charity: ICharity }>('charity');

    //@ts-expect-error TODO:Fix this , IDK why ts can't infer that charity is populated
    const charityName = usedItem.charity?.name;

    const notificationMessage = {
      booking: `Your item ${usedItem.title} has been booked by ${charityName} charity`,
      bookingConfirmation: `Your item ${usedItem.title} booking has been confirmed by ${charityName} charity`,
      bookingCancelation: `Your item ${usedItem.title} booking has been cancelled by ${charityName} charity`,
    };
    const notificationInstance = new notificationManager();
    notificationInstance.sendNotification(
      'User',
      usedItem.user,
      notificationMessage[`${notificationType}`],
      maxAge,
      'usedItem',
      usedItem._id
    );

    usedItem.depopulate('charity');
  }
}
// export const usedItemUtils = {
// addUsedItem,
// getUsedItem,
// validateIdParam,
// checkIfUsedItemBelongsToUser,
// deleteUsedItem,
// updateUsedItem,
// addUsedItemImages,
// deleteUsedItemImage,
// removeUndefinedAttributesFromUsedItemData,
// findAllUsedItems,
// bookUsedItem,
// cancelBookingOfUsedItem,
// ConfirmBookingReceipt,
// isUsedItemBooked,
// createBookItemData,
// };
//
