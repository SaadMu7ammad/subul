import {
  AddUsedItemImageRequest,
  AddUsedItemImageResponse,
  AddUsedItemRequest,
  AddUsedItemResponse,
  DeleteUsedItemImageRequest,
  DeletedUsedItemResponse,
  GetAllUsedItemsResponse,
  GetUsedItemResponse,
  UpdateUsedItemRequest,
  UpdateUsedItemResponse,
} from '@components/used-items/data-access/interfaces/used-item.api';
import { IUser } from '@components/user/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { usedItemUseCaseSkeleton } from '../data-access/interfaces';
import { usedItemServiceClass } from './used-item.service';
import { usedItemUtilsClass } from './used-item.utils';

export class usedItemUseCaseClass implements usedItemUseCaseSkeleton {
  usedItemServiceInstance: usedItemServiceClass;
  usedItemUtilsInstance: usedItemUtilsClass;
  constructor() {
    this.usedItemServiceInstance = new usedItemServiceClass();
    this.usedItemUtilsInstance = new usedItemUtilsClass();
  }
  async addUsedItem(req: Request, res: Response, next: NextFunction): Promise<AddUsedItemResponse> {
    const user: IUser = res.locals.user;

    const { title, description, category, amount, images } = req.body;

    const usedItemData: AddUsedItemRequest = {
      title,
      description,
      category,
      amount,
      images,
      user: user._id,
    };

    const responseData = await this.usedItemServiceInstance.addUsedItem(usedItemData);

    return {
      usedItem: responseData.usedItem,
      message: responseData.message,
    };
  }

  //public route
  async getUsedItem(req: Request, res: Response, next: NextFunction): Promise<GetUsedItemResponse> {
    const { id } = req.params;
    const responseData = await this.usedItemServiceInstance.getUsedItem(id);

    return {
      usedItem: responseData.usedItem,
      message: responseData.message,
    };
  }

  async deleteUsedItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<DeletedUsedItemResponse> {
    const { id } = req.params;
    const userId = res.locals.user._id.toString();
    const responseData = await this.usedItemServiceInstance.deleteUsedItem(id, userId);

    return {
      usedItem: responseData.usedItem,
      message: responseData.message,
    };
  }

  async updateUsedItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<UpdateUsedItemResponse> {
    const { id } = req.params;
    const userId = res.locals.user._id.toString();

    const { title, description, category, amount } = req.body;
    const usedItemData: UpdateUsedItemRequest = {
      title,
      description,
      category,
      amount,
    };

    const responseData = await this.usedItemServiceInstance.updateUsedItem(
      id,
      userId,
      usedItemData
    );

    return {
      usedItem: responseData.usedItem,
      message: responseData.message,
    };
  }

  async addUsedItemImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<AddUsedItemImageResponse> {
    const { id } = req.params;
    const userId = res.locals.user._id.toString();
    const { images }: AddUsedItemImageRequest = req.body;
    const responseData = await this.usedItemServiceInstance.addUsedItemImages(id, userId, images);

    return {
      usedItem: responseData.usedItem,
      message: responseData.message,
    };
  }

  async deleteUsedItemImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<AddUsedItemResponse> {
    const { id } = req.params;
    const userId = res.locals.user._id.toString();
    const { imageName }: DeleteUsedItemImageRequest = req.body;

    const responseData = await this.usedItemServiceInstance.deleteUsedItemImage(
      id,
      userId,
      imageName
    );

    return {
      usedItem: responseData.usedItem,
      message: responseData.message,
    };
  }

  async getAllUsedItems(): Promise<GetAllUsedItemsResponse> {
    const usedItemsResponse = await this.usedItemServiceInstance.findAllUsedItems();

    return {
      usedItems: usedItemsResponse.usedItems,
      message: usedItemsResponse.message,
    };
  }

  async bookUsedItem(req: Request, res: Response): Promise<GetUsedItemResponse> {
    const bookItemData = await this.usedItemUtilsInstance.createBookItemData(req, res);

    const usedItemResponse = await this.usedItemServiceInstance.bookUsedItem(bookItemData);
    return {
      usedItem: usedItemResponse.usedItem,
      message: usedItemResponse.message,
    };
  }

  async cancelBookingOfUsedItem(req: Request, res: Response): Promise<GetUsedItemResponse> {
    const bookItemData = await this.usedItemUtilsInstance.createBookItemData(req, res);

    const usedItemsResponse =
      await this.usedItemServiceInstance.cancelBookingOfUsedItem(bookItemData);

    return {
      usedItem: usedItemsResponse.usedItem,
      message: usedItemsResponse.message,
    };
  }

  async ConfirmBookingReceipt(req: Request, res: Response): Promise<GetUsedItemResponse> {
    const bookItemData = await this.usedItemUtilsInstance.createBookItemData(req, res);

    const usedItemsResponse =
      await this.usedItemServiceInstance.ConfirmBookingReceipt(bookItemData);

    return {
      usedItem: usedItemsResponse.usedItem,
      message: usedItemsResponse.message,
    };
  }
}
// export const usedItemUseCase = {
//   addUsedItem,
//   deleteUsedItem,
//   getUsedItem,
//   updateUsedItem,
//   addUsedItemImages,
//   deleteUsedItemImage,
//   getAllUsedItems,
//   bookUsedItem,
//   cancelBookingOfUsedItem,
//   ConfirmBookingReceipt,
// };
