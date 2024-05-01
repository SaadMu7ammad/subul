import { NextFunction, Request, Response } from 'express';
import UsedItem from '../data-access/models/used-item.model';
import { User } from '../../user/data-access/interfaces';
import { AddUsedItemRequest, AddUsedItemResponse } from '../data-access/interfaces/used-item.api';

const addUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const { title, category, description, images, amount } = req.body;
  const user: User = res.locals.user;
  const usedItemData: AddUsedItemRequest = { title, category, description, images, amount, user: user._id};

  const usedItem = await UsedItem.create(usedItemData);

  //   const responseData = await usedService.addUsedItem(usedData, usedImage, user);

  return {
    usedItem: usedItem,
    message: 'Used Item Created Successfully',
  };
};

export const usedItemUseCase = {
  addUsedItem,
};
