import { useQuery } from '@tanstack/react-query';
import { getReviewsByItem } from '../../api/reviews';
import { Skeleton } from './Skeleton';

interface ReviewSectionProps {
  itemId: string;
}

export const ReviewSection = ({ itemId }: ReviewSectionProps) => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['reviews', itemId],
    queryFn: () => getReviewsByItem(itemId),
  });

  if (isLoading) return <Skeleton className="h-32 mt-12" />;
  if (error || !reviews) return null;

  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  return (
    <section className="mt-12 bg-surface p-6 rounded-xl border border-border shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-4">Reviews ({reviews.length})</h2>
      <p className="text-lg font-semibold mb-6">Average Rating: {avgRating.toFixed(1)} / 5.0</p>
      
      <div className="space-y-6">
        {reviews.map(r => (
          <div key={r._id} className="border-b border-border pb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-primary">{r.reviewer.name}</span>
              <span className="text-sm text-text">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-accent mb-1">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
            <p className="text-text">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
