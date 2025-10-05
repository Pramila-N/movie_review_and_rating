import { useState, useEffect } from 'react';
import { Movie, Review } from '../types';
import { X, Star, Users, Calendar, Share2, ArrowUpDown } from 'lucide-react';
import { ReviewItem } from './ReviewItem';
import { ReviewForm } from './ReviewForm';

interface MovieModalProps {
  movie: Movie;
  reviews: Review[];
  onClose: () => void;
  onAddReview: (review: Omit<Review, 'id' | 'timestamp' | 'likes'>) => void;
  onEditReview: (reviewId: string, updatedReview: Partial<Review>) => void;
  onDeleteReview: (reviewId: string) => void;
  onLikeReview: (reviewId: string, username: string) => void;
  currentUser?: string;
  reviewLikes: Record<string, string[]>;
}

type SortOption = 'latest' | 'highest' | 'most-liked';

export const MovieModal = ({
  movie,
  reviews,
  onClose,
  onAddReview,
  onEditReview,
  onDeleteReview,
  onLikeReview,
  currentUser,
  reviewLikes
}: MovieModalProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const movieReviews = reviews.filter(r => r.movieId === movie.id);
  const averageRating = movieReviews.length > 0
    ? (movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length).toFixed(1)
    : 'N/A';

  const sortedReviews = [...movieReviews].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return b.timestamp - a.timestamp;
      case 'highest':
        return b.rating - a.rating;
      case 'most-liked':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: movie.title,
      text: `Check out "${movie.title}" (${movie.year}) - Rated ${averageRating}⭐`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      const text = `${shareData.title} - ${shareData.text}`;
      navigator.clipboard.writeText(text);
      alert('Review link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp border border-red-900/30">
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 border-b border-red-800 p-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-500/30 rounded-lg transition-colors duration-200"
            title="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-xl shadow-lg"
              />
              <button
                onClick={handleShare}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-medium transition-colors duration-200"
                title="Share this movie"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.map(g => (
                  <span key={g} className="px-3 py-1 bg-red-900/50 text-red-300 text-sm rounded-full border border-red-700/30">
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 mb-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-white">{averageRating}</span>
                  <span>({movieReviews.length} reviews)</span>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">{movie.description}</p>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-red-400" />
                  <h3 className="font-semibold text-white">Cast</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map(actor => (
                    <span key={actor} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-red-900/30 pt-6">
            <h3 className="text-xl font-bold text-white mb-4">Add Your Review</h3>
            <ReviewForm
              movieId={movie.id}
              onSubmit={onAddReview}
              editingReview={editingReview}
              onCancelEdit={() => setEditingReview(null)}
              onUpdate={(updated) => {
                if (editingReview) {
                  onEditReview(editingReview.id, updated);
                  setEditingReview(null);
                }
              }}
            />
          </div>

          <div className="border-t border-red-900/30 pt-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Reviews ({movieReviews.length})
              </h3>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-red-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1.5 bg-gray-800 text-white rounded-lg border-none text-sm focus:ring-2 focus:ring-red-500"
                  title="Sort Reviews"
                >
                  <option value="latest">Latest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="most-liked">Most Liked</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {sortedReviews.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  No reviews yet. Be the first to review this movie!
                </p>
              ) : (
                sortedReviews.map(review => (
                  <ReviewItem
                    key={review.id}
                    review={review}
                    currentUser={currentUser}
                    onEdit={() => setEditingReview(review)}
                    onDelete={() => onDeleteReview(review.id)}
                    onLike={() => onLikeReview(review.id, currentUser || 'Guest')}
                    hasLiked={reviewLikes[review.id]?.includes(currentUser || 'Guest')}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
