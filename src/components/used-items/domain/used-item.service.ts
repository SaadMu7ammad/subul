import { PlainIUsedItem } from "../data-access/interfaces";
import { usedItemUtils } from "./used-item.utils";

const addUsedItem = async (usedItemData:PlainIUsedItem) => {
    const usedItem = await usedItemUtils.addUsedItem(usedItemData);

    return{ 
        usedItem,
        message: 'Used Item Created Successfully',
    }

}

export const usedItemService = {
    addUsedItem,
};