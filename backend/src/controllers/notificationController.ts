import { Request, Response } from 'express';
import * as notificationService from '../services/notificationService';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await notificationService.getNotifications((req as any).user);
    res.status(200).json(notifications);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await notificationService.markAsRead((req as any).user, req.params.id);
    res.status(200).json(notification);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
