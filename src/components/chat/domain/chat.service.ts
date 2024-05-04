import { charityUtils } from "../../charity/domain/charity.utils";
import { userUtils } from "../../user/domain/user.utils";
import { chatRepository } from "../data-access/chat.repository";
import { sendMessageResponse } from "../data-access/interfaces";

const sendMessage = async (typeSender: string, message: string, senderId: string, receiverId: string): Promise<sendMessageResponse> => {
  const _chatRepository = new chatRepository()
 
  //check the reciever id is exist 
  if (typeSender === 'user') await charityUtils.checkCharityIsExistById(receiverId);
  else  await userUtils.checkUserIsExistById(receiverId);


  //create a conversation if it not exist
  const conversation = await _chatRepository.createConversationOrGetTheExist(senderId, receiverId)

  const createdMessage = await _chatRepository.createMessage(senderId, receiverId, message)

  //store message id in the messages array of the conversation
  conversation.messages.push(createdMessage._id)

  await conversation.save();

  return { message: createdMessage }
};

export const chatService = {
  sendMessage
};
