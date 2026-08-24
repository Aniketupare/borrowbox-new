import { apiClient } from './apiClient';

export interface INotification {
  _id: string;
  user: string;
  type: 'BORROW_REQUEST' | 'BOOKING_UPDATE' | 'REVIEW' | 'DAMAGE_REPORT' | 'DISPUTE' | 'MESSAGE';
  content: string;
  isRead: boolean;
  referenceId: string;
  createdAt: string;
}

export const getNotifications = async (): Promise<INotification[]> => {
  const { data } = await apiClient.get('/notifications');
  return data;
};

export const markAsRead = async (id: string): Promise<INotification> => {
  const { data } = await apiClient.put(`/notifications/${id}/read`);
  return data;
};
