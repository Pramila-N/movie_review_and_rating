import { Review } from '../types';
import { StarRating } from './StarRating';
import { ThumbsUp, CreditCard as Edit2, Trash2, Smile, Frown } from 'lucide-react';

interface ReviewItemProps {
  review: Review;
  currentUser?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onLike?: () => void;
  hasLiked?: boolean;
}

export const ReviewItem = ({ review, currentUser, onEdit, onDelete, onLike, hasLiked }: ReviewItemProps) => {
  const isOwner = currentUser === review.username;
  const date = new Date(review.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 transition-all duration-200 hover:shadow-md border border-red-900/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{review.avatar}</div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white">{review.username}</h4>
              {review.sentiment === 'positive' && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                  <Smile className="w-3 h-3" />
                  Positive
                </span>
              )}
              {review.sentiment === 'negative' && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs rounded-full">
                  <Frown className="w-3 h-3" />
                  Critical
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} readonly size="sm" />
        </div>
      </div>

      <p className="text-gray-300 mb-3 leading-relaxed">{review.comment}</p>

      <div className="flex items-center justify-between">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
            hasLiked
              ? 'bg-red-900/50 text-red-300 border border-red-700'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{review.likes}</span>
        </button>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
