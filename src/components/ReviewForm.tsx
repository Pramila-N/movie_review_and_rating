import { useState, useEffect } from 'react';
import { Review } from '../types';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  movieId: string;
  onSubmit: (review: Omit<Review, 'id' | 'timestamp' | 'likes'>) => void;
  editingReview?: Review | null;
  onCancelEdit?: () => void;
  onUpdate?: (updated: Partial<Review>) => void;
}

const AVATAR_OPTIONS = ['😊', '😎', '🤓', '😍', '🤩', '🧐', '🤔', '😇', '🥳', '🤠', '👻', '🐱', '🐶', '🦁', '🐼'];

export const ReviewForm = ({ movieId, onSubmit, editingReview, onCancelEdit, onUpdate }: ReviewFormProps) => {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('😊');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (editingReview) {
      setUsername(editingReview.username);
      setAvatar(editingReview.avatar);
      setRating(editingReview.rating);
      setComment(editingReview.comment);
    }
  }, [editingReview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || rating === 0 || !comment.trim()) {
      alert('Please fill in all fields and provide a rating');
      return;
    }

    if (editingReview && onUpdate) {
      onUpdate({ username, avatar, rating, comment });
      resetForm();
    } else {
      onSubmit({
        movieId,
        username: username.trim(),
        avatar,
        rating,
        comment: comment.trim(),
        sentiment: undefined
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setUsername('');
    setAvatar('😊');
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg p-6 space-y-4 border border-red-900/30">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg border border-red-700/30 bg-gray-900 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
            maxLength={30}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Avatar
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="w-full px-4 py-2 rounded-lg border border-red-700/30 bg-gray-900 text-left flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200"
            >
              <span className="text-2xl">{avatar}</span>
              <span className="text-gray-400">Choose avatar</span>
            </button>

            {showAvatarPicker && (
              <div className="absolute z-10 mt-2 w-full bg-gray-900 rounded-lg shadow-xl border border-red-700/30 p-3 grid grid-cols-5 gap-2">
                {AVATAR_OPTIONS.map((emo) => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => {
                      setAvatar(emo);
                      setShowAvatarPicker(false);
                    }}
                    className={`text-2xl p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 ${
                      avatar === emo ? 'bg-red-900/50' : ''
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rating
        </label>
        <StarRating rating={rating} onRatingChange={setRating} size="lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this movie..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-red-700/30 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
          maxLength={500}
        />
        <p className="text-sm text-gray-400 mt-1 text-right">
          {comment.length}/500
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {editingReview ? 'Update Review' : 'Submit Review'}
        </button>

        {editingReview && onCancelEdit && (
          <button
            type="button"
            onClick={() => {
              onCancelEdit();
              resetForm();
            }}
            className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
