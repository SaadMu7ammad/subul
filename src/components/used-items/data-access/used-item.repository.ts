import { PlainIUsedItem,UsedItemDao } from "./interfaces";
import UsedItem from "./models/used-item.model";

export class UsedItemRepository implements UsedItemDao{
    async addUsedItem(usedItemData:PlainIUsedItem) {
        const usedItem = await UsedItem.create(usedItemData);
        return usedItem;
    }
}