import { BookItemRequest, PlainIUsedItem, UsedItemDao } from './interfaces';
import UsedItem from './models/used-item.model';

export class UsedItemRepository implements UsedItemDao {
  async addUsedItem(usedItemData: PlainIUsedItem) {
    const usedItem = await UsedItem.create(usedItemData);
    return usedItem;
  }

  async findAllUsedItems() {
    const usedItems = await UsedItem.find();
    return usedItems;
  }

  async findAndUpdateToBooked(bookItemData: BookItemRequest) {
    const usedItem = await UsedItem.findOneAndUpdate(
      {
        _id: bookItemData.itemId,
        booked: false,
      },
      {
        $set: {
          booked: true,
          charity: bookItemData.charity,
        },
      },
      { new: true }
    );

    return usedItem;
  }

  async findBookedItem(bookItemData: BookItemRequest) {
    const usedItem = await UsedItem.findOne({
      _id: bookItemData.itemId,
      booked: true,
      confirmed: false,
      charity: bookItemData.charity,
    });

    return usedItem;
  }
  // async findBooked(bookItemData: BookItemRequest) {
  //   const usedItem = await UsedItem.findOne({
  //     _id: bookItemData.itemId,
  //     booked: true,
  //     charity: bookItemData.charity,
  //   });

  //   return usedItem;
  // }
}
