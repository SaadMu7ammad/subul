import { NextFunction, Request, Response } from 'express';
import { User } from '../../user/data-access/interfaces';
import { AddUsedItemRequest, AddUsedItemResponse, deletedUsedItemResponse } from '../data-access/interfaces/used-item.api';
import { usedItemService } from './used-item.service';

const addUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  // const { title, category, description, images, amount } = req.body;
  const user: User = res.locals.user;
  const usedItemData: AddUsedItemRequest = req.body;
  usedItemData.user = user._id;

  const responseData = await usedItemService.addUsedItem(usedItemData);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
};

const deleteUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<deletedUsedItemResponse> => {
  const { id } = req.params;
  const userId = res.locals.user._id.toString();
  const responseData = await usedItemService.deleteUsedItem(id, userId);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
}

export const usedItemUseCase = {
  addUsedItem,
  deleteUsedItem,
};
