import { Booking, BookingStatus } from '../models/Booking';
import { BorrowRequest, RequestStatus } from '../models/BorrowRequest';
import { Item } from '../models/Item';

export const createBooking = async (userId: string, borrowRequestId: string) => {
  const request = await BorrowRequest.findById(borrowRequestId).populate('item');
  if (!request) throw new Error('Borrow request not found');
  if (request.status !== RequestStatus.APPROVED) throw new Error('Request must be approved to create a booking');
  if (request.borrower.toString() !== userId.toString() && request.owner.toString() !== userId.toString()) throw new Error('Unauthorized');

  // Check for overlaps with ACTIVE/CONFIRMED bookings
  const overlap = await Booking.findOne({
    item: request.item,
    status: { $in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
    $or: [
      { startDate: { $lt: request.endDate }, endDate: { $gt: request.startDate } }
    ]
  });
  if (overlap) throw new Error('Item is already booked for this period');

  const item = request.item as any;
  const durationDays = Math.ceil((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalFee = item.borrowingFee * durationDays;

  return await Booking.create({
    item: request.item,
    borrower: request.borrower,
    owner: request.owner,
    borrowRequest: request._id,
    startDate: request.startDate,
    endDate: request.endDate,
    status: BookingStatus.CONFIRMED,
    securityDeposit: item.securityDeposit,
    borrowingFee: totalFee
  });
};

export const getBookings = async (userId: string) => {
  return await Booking.find({
    $or: [{ borrower: userId }, { owner: userId }]
  }).populate('item borrower owner', 'title name email');
};

export const getBookingById = async (id: string, userId: string) => {
  const booking = await Booking.findById(id).populate('item borrower owner', 'title name email');
  if (!booking) throw new Error('Booking not found');
  if (booking.borrower.toString() !== userId && booking.owner.toString() !== userId) throw new Error('Unauthorized');
  return booking;
};

export const updateBookingStatus = async (id: string, userId: string, status: BookingStatus) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new Error('Booking not found');

  if (status === BookingStatus.RETURNED) {
    if (booking.owner.toString() !== userId.toString()) throw new Error('Only owner can mark as returned');
  } else if (status === BookingStatus.CANCELLED) {
    if (booking.borrower.toString() !== userId.toString() && booking.owner.toString() !== userId.toString()) throw new Error('Unauthorized');
  }

  booking.status = status;
  const savedBooking = await booking.save();

  if (status === BookingStatus.RETURNED) {
    await Item.findByIdAndUpdate(booking.item, { status: 'Available' });
  }

  return savedBooking;
};
