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
    await UsedItem.deleteOne({_id:id});
    }

    async updateUsedItem(usedItem:PlainIUsedItem, usedItemData:PlainIUsedItem){
        const updatedUsedItem= await UsedItem.updateOne(usedItem, usedItemData);
        return updatedUsedItem;
    }
}