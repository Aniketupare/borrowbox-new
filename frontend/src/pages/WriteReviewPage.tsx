import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '../api/reviews';
import { Button } from '../components/ui/Button';

export const WriteReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { bookingId, itemId } = location.state || {};
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', itemId] });
      navigate('/bookings');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId || !itemId) return;
    mutation.mutate({
      booking: bookingId,
      item: itemId,
      rating,
      comment,
    });
  };

  if (!bookingId || !itemId) return <p className="text-center p-8 text-red-500">Invalid review request.</p>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Write a Review</h1>
      <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button" onClick={() => setRating(star)} className={`text-3xl ${star <= rating ? 'text-accent' : 'text-border'}`}>★</button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Comment</label>
          <textarea className="w-full p-3 border border-border rounded-lg bg-surface" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required />
        </div>
        
        <Button type="submit" disabled={mutation.isPending || rating === 0}>{mutation.isPending ? 'Submitting...' : 'Submit Review'}</Button>
      </form>
    </div>
  );
};
