import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components';
import { IUsedItem, PlainIUsedItem } from '../data-access/interfaces';
import { UsedItemRepository } from '../data-access/used-item.repository';

const usedItemRepository = new UsedItemRepository();

const addUsedItem = async (usedItemData: PlainIUsedItem) => {
  const usedItem = await usedItemRepository.addUsedItem(usedItemData);
  return usedItem;
};

const getUsedItem = async (id: string) => {
  const usedItem = await usedItemRepository.getUsedItem(id);
  if (!usedItem) {
    throw new NotFoundError('No such UsedItem with this ID');
  }
  return usedItem;
};

const validateIdParam = (id: string | undefined): asserts id is string => {
  if (!id) {
    throw new BadRequestError('No id provided');
  }
};

const checkIfUsedItemBelongsToUser = (usedItem: IUsedItem, userId: string) => {
  console.log(usedItem.user.toString(), userId);
  if (usedItem.user.toString() !== userId) {
    throw new BadRequestError('You are not the owner of this Used Item');
  }
};

const deleteUsedItem = async (id: string) => {
  const deletedUsedItem = await usedItemRepository.deleteUsedItem(id);
  if(!deletedUsedItem){
    throw new NotFoundError('No such UsedItem with this ID');
  }
  return deletedUsedItem;
};

const updateUsedItem = async (id: string, usedItemData: PlainIUsedItem) => {
  const updatedUsedItem = await usedItemRepository.updateUsedItem(
    id,
    usedItemData
  );
  if (!updatedUsedItem) {
    throw new NotFoundError('No such UsedItem with this ID');
  }
  return updatedUsedItem;
};

export const usedItemUtils = {
  addUsedItem,
  getUsedItem,
  validateIdParam,
  checkIfUsedItemBelongsToUser,
  deleteUsedItem,
  updateUsedItem,
};
