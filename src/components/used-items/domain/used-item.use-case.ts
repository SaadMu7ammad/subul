import { NextFunction, Request, Response } from 'express';
import UsedItem, { IUsedItem } from '../data-access/models/used-item.model';
import { User } from '../../user/data-access/interfaces';
import { AddUsedItemResponse } from '../data-access/interfaces/used-item.api';

const addUsedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddUsedItemResponse> => {
  const usedItemData: IUsedItem = req.body;
  const usedItemImage: string = req.body.images[0];
  const user: User = res.locals.user;

  usedItemData.images = [usedItemImage];
  usedItemData.user = user._id;

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
