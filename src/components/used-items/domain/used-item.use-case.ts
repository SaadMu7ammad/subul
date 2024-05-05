import { NextFunction, Request, Response } from 'express';
import { User } from '../../user/data-access/interfaces';
import { AddUsedItemRequest, AddUsedItemResponse, GetUsedItemResponse, DeletedUsedItemResponse } from '../data-access/interfaces/used-item.api';
import { usedItemService } from './used-item.service';

const addUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const user: User = res.locals.user;
  const usedItemData: AddUsedItemRequest = req.body;
  usedItemData.user = user._id;

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
}

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
}

const updateUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const { id } = req.params;
  const userId = res.locals.user._id.toString();
  const usedItemData: AddUsedItemRequest = req.body;
  const responseData = await usedItemService.updateUsedItem(id, userId, usedItemData);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
}

const addUsedItemImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const { id } = req.params;
  const userId = res.locals.user._id.toString();
  const images = req.body.images;
  const responseData = await usedItemService.addUsedItemImages(id, userId, images);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
}

const deleteUsedItemImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const { id } = req.params;
  const userId = res.locals.user._id.toString();
  const imageName = req.body.imageName;

  const responseData = await usedItemService.deleteUsedItemImage(id, userId, imageName);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
}

export const usedItemUseCase = {
  addUsedItem,
  deleteUsedItem,
  getUsedItem,
  updateUsedItem,
  addUsedItemImages,
  deleteUsedItemImage
};
