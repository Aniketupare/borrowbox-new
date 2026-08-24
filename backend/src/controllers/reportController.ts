import { Request, Response } from 'express';
import * as reportService from '../services/reportService';
import { createDamageReportSchema, createDisputeSchema, resolveDisputeSchema } from '../utils/reportValidation';

export const createDamageReport = async (req: Request, res: Response) => {
  try {
    const validatedData = createDamageReportSchema.parse(req.body);
    const report = await reportService.createDamageReport((req as any).user, validatedData);
    res.status(201).json(report);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDamageReport = async (req: Request, res: Response) => {
  try {
    const report = await reportService.getDamageReport(req.params.id, (req as any).user);
    res.status(200).json(report);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDamageReportsByBooking = async (req: Request, res: Response) => {
  try {
    const reports = await reportService.getDamageReportsByBooking(req.params.bookingId, (req as any).user);
    res.status(200).json(reports);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createDispute = async (req: Request, res: Response) => {
  try {
    const validatedData = createDisputeSchema.parse(req.body);
    const dispute = await reportService.createDispute((req as any).user, validatedData);
    res.status(201).json(dispute);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDispute = async (req: Request, res: Response) => {
  try {
    const dispute = await reportService.getDispute(req.params.id, (req as any).user);
    res.status(200).json(dispute);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resolveDispute = async (req: Request, res: Response) => {
  try {
    const validatedData = resolveDisputeSchema.parse(req.body);
    const dispute = await reportService.resolveDispute(req.params.id, (req as any).user, validatedData);
    res.status(200).json(dispute);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
