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

  async getUsedItem(id: string) {
    const usedItem = await UsedItem.findOne({ _id: id });
    return usedItem;
  }

  async deleteUsedItem(id: string) {
    const deletedUsedItem = await UsedItem.findByIdAndDelete(id);
    return deletedUsedItem;
  }

  async updateUsedItem(id: string, usedItemData: Partial<PlainIUsedItem>) {
    const updatedUsedItem = await UsedItem.findByIdAndUpdate(
      id,
      {
        $set: { ...usedItemData },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedUsedItem;
  }
}
