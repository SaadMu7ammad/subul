import UsedItem from '@components/used-items/data-access/models/used-item.model';

export const clearUsedItemsDatabase = async () => {
  await UsedItem.deleteMany({});
};
