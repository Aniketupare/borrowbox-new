import { Review } from '../models/Review';
import { Booking, BookingStatus } from '../models/Booking';
import { User } from '../models/User';

export const createReview = async (reviewerId: string, data: any) => {
  const booking = await Booking.findById(data.bookingId);
  if (!booking) throw new Error('Booking not found');
  if (booking.status !== BookingStatus.RETURNED) throw new Error('Booking must be returned to review');
  if (booking.borrower.toString() !== reviewerId.toString() && booking.owner.toString() !== reviewerId.toString()) throw new Error('Unauthorized');

  const revieweeId = booking.borrower.toString() === reviewerId ? booking.owner : booking.borrower;
  
  const review = await Review.create({
    reviewer: reviewerId,
    reviewee: revieweeId,
    item: booking.item,
    booking: booking._id,
    rating: data.rating,
    comment: data.comment
  });

  // Recalculate average rating
  const stats = await Review.aggregate([
    { $match: { reviewee: revieweeId } },
    { $group: { _id: '$reviewee', avgRating: { $avg: '$rating' } } }
  ]);
  
  if (stats.length > 0) {
    await User.findByIdAndUpdate(revieweeId, { rating: stats[0].avgRating });
  }

  return review;
};

export const getReviewsByUser = async (userId: string) => {
  return await Review.find({ reviewee: userId }).populate('reviewer item', 'name title');
};

export const getReviewsByItem = async (itemId: string) => {
  return await Review.find({ item: itemId }).populate('reviewer', 'name');
};
