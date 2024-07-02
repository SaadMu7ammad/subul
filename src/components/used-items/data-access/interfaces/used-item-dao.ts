import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import {
  AddUsedItemImageResponse,
  BookItemRequest,
  GetAllUsedItemsResponse,
  GetUsedItemResponse,
  IUsedItem,
  PlainIUsedItem,
  UpdateUsedItemRequest,
  UpdateUsedItemResponse,
} from '.';
import { AddUsedItemResponse } from '.';
import { DeletedUsedItemResponse } from '.';

export interface UsedItemDao {
  bookUsedItem: (bookItemData: BookItemRequest) => Promise<IUsedItem | null>;
  addUsedItem: (usedItem: PlainIUsedItem) => Promise<IUsedItem>;
  getUsedItem: (id: string) => Promise<IUsedItem | null>;
  deleteUsedItem: (id: string) => Promise<IUsedItem | null>;
  updateUsedItem: (id: string, usedItem: PlainIUsedItem) => Promise<IUsedItem | null>;
  findAllUsedItems: () => Promise<IUsedItem[]>;
  findAndUpdateToBooked: (bookItemData: BookItemRequest) => Promise<IUsedItem | null>;
  findBookedItem: (bookItemData: BookItemRequest) => Promise<IUsedItem | null>;
}

export interface usedItemServiceSkeleton {
  addUsedItem(
    req: Request,
    usedItemData: PlainIUsedItem
  ): Promise<{ usedItem: IUsedItem; message: string }>;
  findAllUsedItems(req: Request): Promise<{ usedItems: IUsedItem[]; message: string }>;
  bookUsedItem(bookItemData: BookItemRequest): Promise<{ usedItem: IUsedItem; message: string }>;

  cancelBookingOfUsedItem(
    bookItemData: BookItemRequest
  ): Promise<{ usedItem: IUsedItem; message: string }>;
  ConfirmBookingReceipt(
    bookItemData: BookItemRequest
  ): Promise<{ usedItem: IUsedItem; message: string }>;

  getUsedItem(
    req: Request,
    id: string | undefined
  ): Promise<{ usedItem: IUsedItem; message: string }>;
  updateUsedItem(
    req: Request,
    id: string | undefined,
    userId: string,
    usedItemData: Partial<IUsedItem>
  ): Promise<{ usedItem: IUsedItem; message: string }>;

  addUsedItemImages(
    req: Request,
    id: string | undefined,
    userId: string,
    images: string[]
  ): Promise<{ usedItem: IUsedItem; message: string }>;

  deleteUsedItemImage(
    req: Request,
    id: string | undefined,
    userId: string,
    imageName: string
  ): Promise<{ usedItem: IUsedItem; message: string }>;
}

export interface usedItemUseCaseSkeleton {
  addUsedItem(req: Request, res: Response, next: NextFunction): Promise<AddUsedItemResponse>;
  getUsedItem(req: Request, res: Response, next: NextFunction): Promise<GetUsedItemResponse>;
  deleteUsedItem(req: Request, res: Response, next: NextFunction): Promise<DeletedUsedItemResponse>;

  updateUsedItem(req: Request, res: Response, next: NextFunction): Promise<UpdateUsedItemResponse>;

  addUsedItemImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<AddUsedItemImageResponse>;

  deleteUsedItemImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<AddUsedItemResponse>;
  getAllUsedItems(req: Request): Promise<GetAllUsedItemsResponse>;
  bookUsedItem(req: Request, res: Response): Promise<GetUsedItemResponse>;
  cancelBookingOfUsedItem(req: Request, res: Response): Promise<GetUsedItemResponse>;

  ConfirmBookingReceipt(req: Request, res: Response): Promise<GetUsedItemResponse>;
}

export interface usedItemUtilsSkeleton {
  getUsedItem(id: string): Promise<IUsedItem>;

  validateIdParam(id: string | undefined): asserts id is string;

  checkIfUsedItemBelongsToUser(req: Request, usedItem: IUsedItem, userId: string): void;

  deleteUsedItem(id: string): Promise<IUsedItem>;

  updateUsedItem(id: string, usedItemData: UpdateUsedItemRequest): Promise<IUsedItem>;

  addUsedItemImages(id: string, images: string[]): Promise<IUsedItem>;

  deleteUsedItemImage(id: string, imageName: string): Promise<IUsedItem>;
  removeUndefinedAttributesFromUsedItemData(usedItemData: Partial<PlainIUsedItem>): {
    [k: string]: string | number | boolean | Types.ObjectId | string[];
  };
  addUsedItem(usedItemData: PlainIUsedItem): Promise<IUsedItem>;

  findAllUsedItems(): Promise<{ usedItems: IUsedItem[]; message?: string }>;
  createBookItemData(req: Request, res: Response): Promise<BookItemRequest>;

  bookUsedItem(bookItemData: BookItemRequest): Promise<IUsedItem>;

  cancelBookingOfUsedItem(bookItemData: BookItemRequest): Promise<IUsedItem>;

  ConfirmBookingReceipt(bookItemData: BookItemRequest): Promise<IUsedItem>;

  isUsedItemBooked(usedItem: IUsedItem): void;

  notifyUserAboutUsedItemBooking(
    usedItem: IUsedItem,
    notificationType: 'booking' | 'bookingConfirmation' | 'bookingCancelation',
    maxAge: number | undefined
  ): Promise<void>;
}
