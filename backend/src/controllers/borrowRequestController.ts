import { Request, Response } from 'express';
import * as borrowRequestService from '../services/borrowRequestService';
import { createBorrowRequestSchema } from '../utils/borrowRequestValidation';
import { RequestStatus } from '../models/BorrowRequest';

export const createBorrowRequest = async (req: Request, res: Response) => {
  try {
    const validatedData = createBorrowRequestSchema.parse(req.body);
    const request = await borrowRequestService.createBorrowRequest((req as any).user, validatedData);
    res.status(201).json(request);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBorrowRequests = async (req: Request, res: Response) => {
  try {
    const requests = await borrowRequestService.getBorrowRequests((req as any).user);
    res.status(200).json(requests);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const approveRequest = async (req: Request, res: Response) => {
  try {
    const request = await borrowRequestService.updateRequestStatus(req.params.id, (req as any).user, RequestStatus.APPROVED);
    res.status(200).json(request);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const request = await borrowRequestService.updateRequestStatus(req.params.id, (req as any).user, RequestStatus.REJECTED);
    res.status(200).json(request);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelRequest = async (req: Request, res: Response) => {
  try {
    const request = await borrowRequestService.updateRequestStatus(req.params.id, (req as any).user, RequestStatus.CANCELLED);
    res.status(200).json(request);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
