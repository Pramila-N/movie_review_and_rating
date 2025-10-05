import { Movie, Review } from '../types';
import { Star, Film } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  reviews: Review[];
  onViewDetails: () => void;
  isMovieOfTheDay?: boolean;
}

export const MovieCard = ({ movie, reviews, onViewDetails, isMovieOfTheDay }: MovieCardProps) => {
  const movieReviews = reviews.filter(r => r.movieId === movie.id);
  const averageRating = movieReviews.length > 0
    ? (movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/50 relative group border border-red-900/30">
      {isMovieOfTheDay && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
          <Film className="w-4 h-4" />
          Movie of the Day
        </div>
      )}

      <div className="relative h-64 overflow-hidden bg-gray-800">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
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
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
