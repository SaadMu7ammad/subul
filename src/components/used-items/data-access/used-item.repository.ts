import { PlainIUsedItem, UsedItemDao } from './interfaces';
import UsedItem from './models/used-item.model';

export class UsedItemRepository implements UsedItemDao {
  async addUsedItem(usedItemData: PlainIUsedItem) {
    const usedItem = await UsedItem.create(usedItemData);
    console.log(usedItem);
    return usedItem;
  }

  async findAllUsedItems() {
    const usedItems = await UsedItem.find().select('-__v').exec();
    return usedItems;
  }

  async bookUsedItem(usedItemId: string) {
    const usedItem = await UsedItem.findOneAndUpdate(
      {
        _id: usedItemId,
        booked: false,
      },
      {
        $set: {
          booked: true,
        },
      },
      { new: true }
    );

    return usedItem;
  }
}
