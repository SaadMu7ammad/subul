import { PlainIUsedItem,UsedItemDao } from "./interfaces";
import UsedItem from "./models/used-item.model";

export class UsedItemRepository implements UsedItemDao{
    async addUsedItem(usedItemData:PlainIUsedItem) {
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

    async updateUsedItem(id:string, usedItemData:PlainIUsedItem){
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
}