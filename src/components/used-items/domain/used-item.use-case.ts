import { NextFunction, Request, Response } from 'express';
import { User } from '../../user/data-access/interfaces';
import {
  AddUsedItemRequest,
  AddUsedItemResponse,
} from '../data-access/interfaces/used-item.api';
import { usedItemService } from './used-item.service';
import { NotFoundError } from '../../../libraries/errors/components';
import { usedItemUtils } from './used-item.utils';

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
  };

  const responseData = await usedItemService.addUsedItem(usedItemData);

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

  const usedItemsResponse = await usedItemService.cancelBookingOfUsedItem(
    bookItemData
  );

  return {
    usedItem: usedItemsResponse.usedItem,
    message: usedItemsResponse.message,
  };
};

const ConfirmBookingReceipt = async (req: Request, res: Response) => {
  const bookItemData = await usedItemUtils.createBookItemData(req, res);

  const usedItemsResponse = await usedItemService.ConfirmBookingReceipt(
    bookItemData
  );

  return {
    usedItem: usedItemsResponse.usedItem,
    message: usedItemsResponse.message,
  };
};

export const usedItemUseCase = {
  addUsedItem,
  getAllUsedItems,
  bookUsedItem,
  cancelBookingOfUsedItem,
  ConfirmBookingReceipt,
};
