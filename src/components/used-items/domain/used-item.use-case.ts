import {
  AddUsedItemImageRequest,
  AddUsedItemImageResponse,
  AddUsedItemRequest,
  AddUsedItemResponse,
  DeleteUsedItemImageRequest,
  DeletedUsedItemResponse,
  GetUsedItemResponse,
  UpdateUsedItemRequest,
  UpdateUsedItemResponse,
} from '@components/used-items/data-access/interfaces/used-item.api';
import { User } from '@components/user/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { usedItemService } from './used-item.service';
import { usedItemUtils } from './used-item.utils';

const addUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const user: User = res.locals.user;

  const { title, description, category, amount, images } = req.body;

  const usedItemData: AddUsedItemRequest = {
    title,
    description,
    category,
    amount,
    images,
    user: user._id,
  };

  const responseData = await usedItemService.addUsedItem(usedItemData);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
};

//public route
const getUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<GetUsedItemResponse> => {
  const { id } = req.params;
  const responseData = await usedItemService.getUsedItem(id);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
};

const deleteUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<DeletedUsedItemResponse> => {
  const { id } = req.params;
  const userId = res.locals.user._id.toString();
  const responseData = await usedItemService.deleteUsedItem(id, userId);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
};

const updateUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<UpdateUsedItemResponse> => {
  const { id } = req.params;
  const userId = res.locals.user._id.toString();

  const { title, description, category, amount } = req.body;
  const usedItemData: UpdateUsedItemRequest = {
    title,
    description,
    category,
    amount,
  };

  const responseData = await usedItemService.updateUsedItem(id, userId, usedItemData);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
};

const addUsedItemImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemImageResponse> => {
  const { id } = req.params;
  const userId = res.locals.user._id.toString();
  const { images }: AddUsedItemImageRequest = req.body;
  const responseData = await usedItemService.addUsedItemImages(id, userId, images);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
};

const deleteUsedItemImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const { id } = req.params;
  const userId = res.locals.user._id.toString();
  const { imageName }: DeleteUsedItemImageRequest = req.body;

  const responseData = await usedItemService.deleteUsedItemImage(id, userId, imageName);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
};

const getAllUsedItems = async () => {
  const usedItemsResponse = await usedItemService.findAllUsedItems();

  return {
    usedItems: usedItemsResponse.usedItems,
    message: usedItemsResponse.message,
  };
};

const bookUsedItem = async (req: Request, res: Response) => {
  const bookItemData = await usedItemUtils.createBookItemData(req, res);

  const usedItemResponse = await usedItemService.bookUsedItem(bookItemData);
  return {
    usedItem: usedItemResponse.usedItem,
    message: usedItemResponse.message,
  };
};

const cancelBookingOfUsedItem = async (req: Request, res: Response) => {
  const bookItemData = await usedItemUtils.createBookItemData(req, res);

  const usedItemsResponse = await usedItemService.cancelBookingOfUsedItem(bookItemData);

  return {
    usedItem: usedItemsResponse.usedItem,
    message: usedItemsResponse.message,
  };
};

const ConfirmBookingReceipt = async (req: Request, res: Response) => {
  const bookItemData = await usedItemUtils.createBookItemData(req, res);

  const usedItemsResponse = await usedItemService.ConfirmBookingReceipt(bookItemData);

  return {
    usedItem: usedItemsResponse.usedItem,
    message: usedItemsResponse.message,
  };
};

export const usedItemUseCase = {
  addUsedItem,
  deleteUsedItem,
  getUsedItem,
  updateUsedItem,
  addUsedItemImages,
  deleteUsedItemImage,
  getAllUsedItems,
  bookUsedItem,
  cancelBookingOfUsedItem,
  ConfirmBookingReceipt,
};
