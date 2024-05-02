import { NextFunction, Request, Response } from 'express';
import { User } from '../../user/data-access/interfaces';
import {
  AddUsedItemRequest,
  AddUsedItemResponse,
  BookItemRequest,
} from '../data-access/interfaces/used-item.api';
import { usedItemService } from './used-item.service';
import { NotFoundError } from '../../../libraries/errors/components';
import { ICharity } from '../../charity/data-access/interfaces';

const addUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const { title, category, description, images, amount } = req.body;
  const user: User = res.locals.user;

  if (!user) throw new NotFoundError('User Must Login First!');

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
  const charity: ICharity = res.locals.charity;

  if (!charity) throw new NotFoundError('Charity Must Login First!');
  // const { id }: { id?: string } = req.params;
  const { itemId }: { itemId: string } = req.body;

  const bookItemData: BookItemRequest = {
    charity: charity._id.toString(),
    itemId,
  };

  const usedItemsResponse = await usedItemService.bookUsedItem(bookItemData);
  return {
    usedItems: usedItemsResponse.usedItems,
    message: usedItemsResponse.message,
  };
};

const cancelBookingOfUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const charity: ICharity = res.locals.charity;
  if (!charity) throw new NotFoundError('Charity Must Login First!');
  const { itemId }: { itemId: string } = req.body;
  const bookItemData: BookItemRequest = {
    charity: charity._id.toString(),
    itemId,
  };

  if (!itemId) throw new NotFoundError('Used Item Id Not Found');

  const usedItemsResponse = await usedItemService.cancelBookingOfUsedItem(
    bookItemData
  );

  return {
    usedItems: usedItemsResponse.usedItems,
    message: usedItemsResponse.message,
  };
};

export const usedItemUseCase = {
  addUsedItem,
  getAllUsedItems,
  bookUsedItem,
  cancelBookingOfUsedItem,
};
