import { BookItemRequest, PlainIUsedItem, UsedItemDao } from './interfaces';
import UsedItem from './models/used-item.model';

export class UsedItemRepository implements UsedItemDao {
  async addUsedItem(usedItemData: PlainIUsedItem) {
    const usedItem = await UsedItem.create(usedItemData);
    return usedItem;
  }

    async getUsedItem(id: string) {
        const usedItem = await UsedItem.findOne({_id:id});
        return usedItem;
    }

    async deleteUsedItem(id: string){
      const deletedUsedItem = await UsedItem.findByIdAndDelete(id);
      return deletedUsedItem;
    }

    async updateUsedItem(id:string, usedItemData:Partial<PlainIUsedItem>){
        const updatedUsedItem = await UsedItem.findByIdAndUpdate(
      id,
      {
        $set: { ...usedItemData },
      },
      {
        new: true,
        runValidators: true,
      }
    ) 
        return updatedUsedItem;
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
