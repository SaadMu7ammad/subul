import { PlainIUsedItem } from "../data-access/interfaces";
import { usedItemUtils } from "./used-item.utils";

const addUsedItem = async (usedItemData:PlainIUsedItem) => {
    const usedItem = await usedItemUtils.addUsedItem(usedItemData);

    return{ 
        usedItem,
        message: 'Used Item Created Successfully',
    }
}

const deleteUsedItem = async (id:string | undefined, userId:string) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕
    //check if the used item exists
    const usedItem = await usedItemUtils.getUsedItem(id);
    //check if the user is the owner of the used item
    usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);
    //TODO:check if the usedItem is booked or not
    //delete the used item
    await usedItemUtils.deleteUsedItem(usedItem.id);

    return{
        usedItem: usedItem,
        message:'Used Item Deleted Successfully' ,
    }
}

export const usedItemService = {
    addUsedItem,
    deleteUsedItem
};