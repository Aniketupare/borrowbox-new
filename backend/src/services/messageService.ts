import { Conversation } from '../models/Conversation';
import { Message, MessageStatus } from '../models/Message';
import { Types } from 'mongoose';

export const getConversations = async (userId: string) => {
  return await Conversation.find({ participants: userId })
    .populate('participants', 'name email')
    .populate('lastMessage');
};

export const startConversation = async (userId: string, recipientId: string) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId], $size: 2 }
  }).populate('participants', 'name email');

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, recipientId]
    });
    conversation = await Conversation.findById(conversation._id).populate('participants', 'name email');
  }

  return conversation;
};

export const createMessage = async (conversationId: string, senderId: string, content: string) => {
  const created = await Message.create({ conversation: conversationId, sender: senderId, content });
  await Conversation.findByIdAndUpdate(conversationId, { lastMessage: created._id });
  const message = await Message.findById(created._id).populate('sender', 'name');
  return message;
};

export const getMessages = async (conversationId: string) => {
  return await Message.find({ conversation: conversationId }).populate('sender', 'name').sort({ createdAt: 1 });
};

export const markAsRead = async (conversationId: string, userId: string) => {
    // Logic to update lastReadAt for user in conversation
    // For simplicity, update all sent/delivered messages to read
    return await Message.updateMany(
        { conversation: conversationId, sender: { $ne: userId }, status: { $ne: MessageStatus.READ } },
        { status: MessageStatus.READ }
    );
};
