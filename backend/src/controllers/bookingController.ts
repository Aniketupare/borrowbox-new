import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';
import { createBookingSchema } from '../utils/bookingValidation';
import { BookingStatus } from '../models/Booking';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const validatedData = createBookingSchema.parse(req.body);
    const booking = await bookingService.createBooking((req as any).user, validatedData.borrowRequestId);
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getBookings((req as any).user);
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, (req as any).user);
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const returnBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.updateBookingStatus(req.params.id, (req as any).user, BookingStatus.RETURNED);
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.updateBookingStatus(req.params.id, (req as any).user, BookingStatus.CANCELLED);
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
