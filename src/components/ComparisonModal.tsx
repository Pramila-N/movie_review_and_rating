import { Movie, Review } from '../types';
import { X, Star } from 'lucide-react';
import { useEffect } from 'react';

interface ComparisonModalProps {
  movie1: Movie;
  movie2: Movie;
  reviews: Review[];
  onClose: () => void;
}

export const ComparisonModal = ({ movie1, movie2, reviews, onClose }: ComparisonModalProps) => {
  const getMovieStats = (movie: Movie) => {
    const movieReviews = reviews.filter(r => r.movieId === movie.id);
    const avgRating = movieReviews.length > 0
      ? (movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length).toFixed(1)
      : 'N/A';

    return {
      avgRating,
      reviewCount: movieReviews.length,
      totalLikes: movieReviews.reduce((sum, r) => sum + r.likes, 0)
    };
  };

  const stats1 = getMovieStats(movie1);
  const stats2 = getMovieStats(movie2);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md sm:max-w-3xl lg:max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp border border-red-900/30">
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 border-b border-red-800 p-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-white">Movie Comparison</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-500/30 rounded-lg transition-colors duration-200"
            title="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img
                src={movie1.poster}
                alt={movie1.title}
                className="w-full rounded-xl shadow-lg"
              />
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{movie1.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg shadow text-lg font-bold text-amber-400">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    {stats1.avgRating}
                  </span>
                  <span className="text-gray-400 ml-2">({stats1.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <img
                src={movie2.poster}
                alt={movie2.title}
                className="w-full rounded-xl shadow-lg"
              />
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{movie2.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg shadow text-lg font-bold text-amber-400">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    {stats2.avgRating}
                  </span>
                  <span className="text-gray-400 ml-2">({stats2.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-4 text-left text-white font-semibold">Category</th>
                  <th className="p-4 text-left text-white font-semibold">{movie1.title}</th>
                  <th className="p-4 text-left text-white font-semibold">{movie2.title}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-red-900/30">
                  <td className="p-4 font-medium text-gray-300">Year</td>
                  <td className="p-4 text-white">{movie1.year}</td>
                  <td className="p-4 text-white">{movie2.year}</td>
                </tr>
                <tr className="border-b border-red-900/30">
                  <td className="p-4 font-medium text-gray-300">Genres</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {movie1.genre.map(g => (
                        <span key={g} className="px-2 py-1 bg-red-900/50 text-red-300 text-xs rounded-full border border-red-700/30">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {movie2.genre.map(g => (
                        <span key={g} className="px-2 py-1 bg-red-900/50 text-red-300 text-xs rounded-full border border-red-700/30">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-red-900/30">
                  <td className="p-4 font-medium text-gray-300">Average Rating</td>
                  <td className="p-4 text-amber-400 font-bold text-lg">{stats1.avgRating} <Star className="inline w-4 h-4 fill-amber-400 text-amber-400 ml-1" /></td>
                  <td className="p-4 text-amber-400 font-bold text-lg">{stats2.avgRating} <Star className="inline w-4 h-4 fill-amber-400 text-amber-400 ml-1" /></td>
                </tr>
                <tr className="border-b border-red-900/30">
                  <td className="p-4 font-medium text-gray-300">Total Reviews</td>
                  <td className="p-4 text-white">{stats1.reviewCount}</td>
                  <td className="p-4 text-white">{stats2.reviewCount}</td>
                </tr>
                <tr className="border-b border-red-900/30">
                  <td className="p-4 font-medium text-gray-300">Total Likes</td>
                  <td className="p-4 text-white">{stats1.totalLikes}</td>
                  <td className="p-4 text-white">{stats2.totalLikes}</td>
                </tr>
                <tr className="border-b border-red-900/30">
                  <td className="p-4 font-medium text-gray-300">Cast</td>
                  <td className="p-4 text-gray-300 text-sm">{movie1.cast.join(', ')}</td>
                  <td className="p-4 text-gray-300 text-sm">{movie2.cast.join(', ')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
