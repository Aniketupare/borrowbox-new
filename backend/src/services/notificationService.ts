import { Notification } from '../models/Notification';
import { Server } from 'socket.io';

export const createNotification = async (io: Server, userId: string, type: any, content: string, referenceId: any) => {
  const notification = await Notification.create({ user: userId, type, content, referenceId });
  io.to(userId).emit('notification', notification);
  return notification;
};

export const getNotifications = async (userId: string) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

export const markAsRead = async (userId: string, notificationId: string) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
};
