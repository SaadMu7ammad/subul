import { NextFunction, Request, Response } from 'express';
import { User } from '../../user/data-access/interfaces';
import {
  AddUsedItemRequest,
  AddUsedItemResponse,
  GetAllUsedItemsResponse,
} from '../data-access/interfaces/used-item.api';
import { usedItemService } from './used-item.service';

const addUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const { title, category, description, images, amount } = req.body;
  const user: User = res.locals.user;
  const usedItemData: AddUsedItemRequest = {
    title,
    category,
    description,
    images,
    amount,
    user: user._id,
  };

  const responseData = await usedItemService.addUsedItem(usedItemData);

  return {
    usedItem: responseData.usedItem,
    message: responseData.message,
  };
};

const getAllUsedItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<GetAllUsedItemsResponse> => {
  const usedItems = await UsedItem.find().select('-__v').exec();

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

const getAllUsedItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<GetAllUsedItemsResponse> => {
  const usedItems = await UsedItem.find().select('-__v').exec();

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

export const usedItemUseCase = {
  addUsedItem,
  getAllUsedItems,
};
