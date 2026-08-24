import { Request } from 'express';
import { createNotification } from '../services/notificationService';

// Add to item controller, borrow request controller, etc.
export const triggerNotification = (req: Request, userId: string, type: any, content: string, referenceId: any) => {
    const io = (req.app as any).io;
    createNotification(io, userId, type, content, referenceId);
};
