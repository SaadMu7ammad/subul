import { NextFunction, Request, Response } from 'express';
import { User } from '../../user/data-access/interfaces';
import {
  AddUsedItemRequest,
  AddUsedItemResponse,
} from '../data-access/interfaces/used-item.api';
import { usedItemService } from './used-item.service';
import { NotFoundError } from '../../../libraries/errors/components';

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
    booked: false,
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
) => {
  const usedItemsResponse = await usedItemService.findAllUsedItems();

  return {
    usedItems: usedItemsResponse.usedItems,
    message: usedItemsResponse.message,
  };
};

const bookUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id }: { id?: string } = req.params;

  if (!id) throw new NotFoundError('Used Item Id Not Found');
  const usedItemsResponse = await usedItemService.bookUsedItem(id);
  return {
    usedItems: usedItemsResponse.usedItems,
    message: usedItemsResponse.message,
  };
};

export const usedItemUseCase = {
  addUsedItem,
  getAllUsedItems,
  bookUsedItem,
};
