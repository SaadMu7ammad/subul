import { BookItemRequest, PlainIUsedItem, UsedItemDao } from './interfaces';
import UsedItem from './models/used-item.model';

export class UsedItemRepository implements UsedItemDao {
  async addUsedItem(usedItemData: PlainIUsedItem) {
    const usedItem = await UsedItem.create(usedItemData);
    return usedItem;
  }

  async findAllUsedItems() {
    const usedItems = await UsedItem.find().select('-__v').exec();
    return usedItems;
  }

  async bookUsedItem(bookItemData: BookItemRequest) {
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

  async cancelBookingOfUsedItem(bookItemData: BookItemRequest) {
    const usedItem = await UsedItem.findOne({
      _id: bookItemData.itemId,
      booked: true,
      confirmed: false,
    });

    return usedItem;
  }

  async ConfirmBookingReceipt(bookItemData: BookItemRequest) {
    const usedItem = await UsedItem.findOne({
      _id: bookItemData.itemId,
      booked: true,
    });

    return usedItem;
  }
}
