import { Star } from 'lucide-react';

export default function StarRating({ rating, count, size = 14 }: { rating: number; count: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const half = !filled && star === Math.ceil(rating) && rating % 1 >= 0.3;
          return (
            <Star
              key={star}
              size={size}
              className={filled ? 'fill-gold-400 text-gold-400' : half ? 'fill-gold-200 text-gold-400' : 'fill-gray-100 text-gray-200'}
            />
          );
        })}
      </div>
      <span className="text-sm font-bold text-brand-900">{rating.toFixed(1)}</span>
      {count > 0 && <span className="text-xs text-gray-400">({count} avis)</span>}
    </div>
  );
}
