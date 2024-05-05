import { deleteOldImgs } from "../../../utils/deleteFile";
import { PlainIUsedItem } from "../data-access/interfaces";
import { usedItemUtils } from "./used-item.utils";

const addUsedItem = async (usedItemData:PlainIUsedItem) => {
    const usedItem = await usedItemUtils.addUsedItem(usedItemData);

    return{ 
        usedItem,
        message: 'Used Item Created Successfully',
    }
}

const getUsedItem = async (id:string|undefined) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    const usedItem = await usedItemUtils.getUsedItem(id);

    return{
        usedItem,
        message: 'Used Item Fetched Successfully',
    }
}

const updateUsedItem = async (id:string|undefined, userId:string, usedItemData:PlainIUsedItem) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await usedItemUtils.getUsedItem(id);

    //check if the user is the owner of the used item
    usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

    //update the used item
    const updatedUsedItem = await usedItemUtils.updateUsedItem(id, usedItemData);

    return{
        usedItem: updatedUsedItem,
        message:'Used Item Updated Successfully',
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
    const deletedUsedItem = await usedItemUtils.deleteUsedItem(usedItem.id);

    //Delete the imgs
    deleteOldImgs('usedItemsImages',usedItem.images);

    return{
        usedItem: deletedUsedItem,
        message:'Used Item Deleted Successfully' ,
    }
}

const addUsedItemImages = async (id:string | undefined, userId:string, images:string[]) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await usedItemUtils.getUsedItem(id);

    //check if the user is the owner of the used item
    usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

    //add the images
    const updatedUsedItem = await usedItemUtils.addUsedItemImages(id, images);

    return{
        usedItem: updatedUsedItem,
        message:'Used Item Images Added Successfully',
    }
}

const deleteUsedItemImage = async (id:string | undefined, userId:string, imageName:string) => {
    //check if the id was sent in the request
    const validate: (id:string|undefined) => asserts id is string =  usedItemUtils.validateIdParam;
    validate(id); //it gives an error if I executed the function directly 🤕

    //check if the used item exists
    const usedItem = await usedItemUtils.getUsedItem(id);

    //check if the user is the owner of the used item
    usedItemUtils.checkIfUsedItemBelongsToUser(usedItem, userId);

    //delete the image
    const updatedUsedItem = await usedItemUtils.deleteUsedItemImage(id, imageName);

    return{
        usedItem: updatedUsedItem,
        message:'Used Item Image Deleted Successfully',
    }
}
export const usedItemService = {
    addUsedItem,
    deleteUsedItem,
    getUsedItem,
    updateUsedItem,
    addUsedItemImages,
    deleteUsedItemImage,
};