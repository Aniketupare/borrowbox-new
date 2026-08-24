import { apiClient } from './apiClient';

export interface IConversation {
  _id: string;
  participants: { _id: string; name: string }[];
  lastMessage: { content: string; createdAt: string };
  unreadCount: number;
}

export interface IMessage {
  _id: string;
  conversation: string;
  sender: { _id: string; name: string };
  content: string;
  createdAt: string;
}

export const getConversations = async (): Promise<IConversation[]> => {
  const { data } = await apiClient.get('/messages/conversations');
  return data;
};

export const startConversation = async (recipientId: string): Promise<IConversation> => {
  const { data } = await apiClient.post('/messages/conversations', { recipientId });
  return data;
};

export const getMessages = async (conversationId: string): Promise<IMessage[]> => {
  const { data } = await apiClient.get(`/messages/${conversationId}`);
  return data;
};
