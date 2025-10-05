
import { Movie, Review } from '../types';
import { Star, Film, Heart, Bookmark } from 'lucide-react';

export interface MovieCardProps {
  movie: Movie;
  reviews: Review[];
  onViewDetails: () => void;
  isMovieOfTheDay?: boolean;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (id: string) => void;
  likeCount?: number;
  onLikeMovie?: (id: string) => void;
}

export const MovieCard = ({ movie, reviews, onViewDetails, isMovieOfTheDay, isInWatchlist, onToggleWatchlist, likeCount, onLikeMovie }: MovieCardProps) => {
  const movieReviews = reviews.filter(r => r.movieId === movie.id);
  const averageRating = movieReviews.length > 0
    ? (movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length).toFixed(1)
    : 'N/A';

  return (
  <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/50 relative group border border-red-900/30 flex flex-col">
      <div className="relative h-44 sm:h-64 overflow-hidden bg-gray-800">
        <img
          src={movie.poster || 'https://via.placeholder.com/400x600?text=No+Image'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=No+Image'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-3 sm:p-5 flex flex-col gap-2 sm:gap-3 flex-1">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2 sm:gap-0">
          {onToggleWatchlist && (
            <button
              title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              onClick={() => onToggleWatchlist(movie.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${isInWatchlist ? 'bg-red-700 text-white border-red-700' : 'bg-gray-800 text-red-300 border-red-700 hover:bg-red-900/60'} shadow`}
            >
              <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-white' : 'fill-none'}`} />
              {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          )}
          {onLikeMovie && (
            <button
              title="Like Movie"
              onClick={() => onLikeMovie(movie.id)}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 bg-gray-800 text-red-300 border border-red-700 hover:bg-red-900/60 shadow"
            >
              <Heart className="w-4 h-4" />
              {likeCount ?? 0}
            </button>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">{movie.title}</h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genre.slice(0, 2).map(g => (
            <span key={g} className="px-2 py-1 bg-red-900/50 text-red-300 text-xs rounded-full border border-red-700/30">
              {g}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">{movie.year}</span>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-white">{averageRating}</span>
            <span className="text-sm text-gray-400">({movieReviews.length})</span>
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg mt-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
