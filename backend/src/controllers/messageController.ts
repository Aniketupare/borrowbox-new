import { Request, Response } from 'express';
import * as messageService from '../services/messageService';
import { Conversation } from '../models/Conversation';

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;
    const conversations = await messageService.getConversations(userId);
    res.status(200).json(conversations);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const startConversation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;
    const { recipientId } = req.body;
    if (!recipientId) return res.status(400).json({ message: 'Recipient ID is required' });
    const conversation = await messageService.startConversation(userId, recipientId);
    res.status(200).json(conversation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;
    const { conversationId } = req.params;
    
    // Security check: Verify user is a participant
    const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conversation) return res.status(403).json({ message: 'Forbidden' });
    
    const messages = await messageService.getMessages(conversationId);
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Security check: Verify user is a participant of the conversation
    const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conversation) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const message = await messageService.createMessage(conversationId, userId, content);

    // Emit via socket if available
    const io = (req.app as any).io;
    if (io) {
      io.to(conversationId).emit('receive_message', message);
    }

    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
