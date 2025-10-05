import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
          className={`transition-all duration-200 ${!readonly ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= (hover || rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-none text-gray-300 dark:text-gray-600'
            } transition-colors duration-200`}
          />
        </button>
      ))}
    </div>
  );
};
