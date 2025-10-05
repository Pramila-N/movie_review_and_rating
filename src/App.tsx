import { useState, useEffect } from 'react';
import { Movie, Review, UserPreferences } from './types';
import { movies } from './data/movies';
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { ComparisonModal } from './components/ComparisonModal';
import { Leaderboard } from './components/Leaderboard';
import { BadgeDisplay } from './components/BadgeDisplay';
import {
  loadReviews,
  saveReviews,
  loadPreferences,
  savePreferences,
  getMovieOfTheDay,
  setMovieOfTheDay,
  loadReviewLikes,
  saveReviewLikes,
  loadMovieLikes,
  saveMovieLikes,
  loadWatchlist,
  saveWatchlist
} from './utils/localStorage';
import { analyzeSentiment } from './utils/sentiment';
import { checkBadges, AVAILABLE_BADGES } from './utils/badges';
import { Film, GitCompare, Search, Filter, Bookmark, X } from 'lucide-react';

function App() {
  const [showWatchlist, setShowWatchlist] = useState(false);
    const [badgeNotification, setBadgeNotification] = useState<{ message: string; icons: string[] } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({ theme: 'light', selectedAvatar: '😊' }); // theme is now ignored
  // Add a class to body for light/dark theme
  // No-op: theme switching removed
  const [movieOfTheDay, setMovieOfDayState] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [reviewLikes, setReviewLikes] = useState<Record<string, string[]>>({});
  const [userBadges, setUserBadges] = useState(AVAILABLE_BADGES);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonMovies, setComparisonMovies] = useState<Movie[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [movieLikes, setMovieLikes] = useState<Record<string, number>>({});
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const storedReviews = loadReviews();
    const storedPreferences = loadPreferences();
    const storedLikes = loadReviewLikes();
    const storedMovieLikes = loadMovieLikes();
    const storedWatchlist = loadWatchlist();

    setReviews(storedReviews);
    setPreferences(storedPreferences);
    setReviewLikes(storedLikes);
    setMovieLikes(storedMovieLikes);
    setWatchlist(storedWatchlist);

    const today = new Date().toDateString();
    const stored = getMovieOfTheDay();

    if (!stored || stored.date !== today) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setMovieOfTheDay(randomMovie.id, today);
      setMovieOfDayState(randomMovie.id);
    } else {
      setMovieOfDayState(stored.movieId);
    }

    if (storedPreferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);
  // Watchlist handlers
  const handleToggleWatchlist = (movieId: string) => {
    let updated: string[];
    if (watchlist.includes(movieId)) {
      updated = watchlist.filter(id => id !== movieId);
    } else {
      updated = [...watchlist, movieId];
    }
    setWatchlist(updated);
    saveWatchlist(updated);
  };

  // Movie like handlers
  const handleLikeMovie = (movieId: string) => {
    const current = movieLikes[movieId] || 0;
    const updated = { ...movieLikes, [movieId]: current + 1 };
    setMovieLikes(updated);
    saveMovieLikes(updated);
  };

  useEffect(() => {
    if (currentUser) {
      const prevBadges = userBadges.filter(b => b.earned).map(b => b.id);
      const badges = checkBadges(reviews, currentUser);
      setUserBadges(badges);
      const newEarned = badges.filter(b => b.earned && !prevBadges.includes(b.id));
      if (newEarned.length > 0) {
          setBadgeNotification({
            message: `You earned a badge: ${newEarned.map(b => b.name).join(', ')}!`,
            icons: newEarned.map(b => b.icon)
          });
        setTimeout(() => setBadgeNotification(null), 4000);
      }
    }
  }, [reviews, currentUser]);

  // Theme toggle removed

  const handleAddReview = (review: Omit<Review, 'id' | 'timestamp' | 'likes'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      timestamp: Date.now(),
      likes: 0,
      sentiment: analyzeSentiment(review.comment)
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
    setCurrentUser(review.username);
  };

  const handleEditReview = (reviewId: string, updatedData: Partial<Review>) => {
    const updatedReviews = reviews.map(r =>
      r.id === reviewId
        ? { ...r, ...updatedData, sentiment: updatedData.comment ? analyzeSentiment(updatedData.comment) : r.sentiment }
        : r
    );
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
  };

  const handleLikeReview = (reviewId: string, username: string) => {
    const currentLikes = reviewLikes[reviewId] || [];
    let updatedLikes: Record<string, string[]>;
    let updatedReviews: Review[];

    if (currentLikes.includes(username)) {
      updatedLikes = {
        ...reviewLikes,
        [reviewId]: currentLikes.filter(u => u !== username)
      };
      updatedReviews = reviews.map(r =>
        r.id === reviewId ? { ...r, likes: Math.max(0, r.likes - 1) } : r
      );
    } else {
      updatedLikes = {
        ...reviewLikes,
        [reviewId]: [...currentLikes, username]
      };
      updatedReviews = reviews.map(r =>
        r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
      );
    }

    setReviewLikes(updatedLikes);
    saveReviewLikes(updatedLikes);
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
  };

  const handleComparisonToggle = (movie: Movie) => {
    if (comparisonMovies.find(m => m.id === movie.id)) {
      setComparisonMovies(comparisonMovies.filter(m => m.id !== movie.id));
    } else if (comparisonMovies.length < 2) {
      setComparisonMovies([...comparisonMovies, movie]);
    } else {
      setComparisonMovies([comparisonMovies[1], movie]);
    }
  };

  const allGenres = Array.from(new Set(movies.flatMap(m => m.genre)));
  const specialFilters = [
    { label: 'Highly Rated', value: '__highly_rated__' },
    { label: 'Most Reviewed', value: '__most_reviewed__' }
  ];

  let filteredMovies = movies;
  if (selectedGenre === '__highly_rated__') {
    filteredMovies = [...movies]
      .filter(movie => reviews.some(r => r.movieId === movie.id))
      .sort((a, b) => {
        const aReviews = reviews.filter(r => r.movieId === a.id);
        const bReviews = reviews.filter(r => r.movieId === b.id);
        const aAvg = aReviews.length ? aReviews.reduce((sum, r) => sum + r.rating, 0) / aReviews.length : 0;
        const bAvg = bReviews.length ? bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length : 0;
        return bAvg - aAvg;
      });
  } else if (selectedGenre === '__most_reviewed__') {
    filteredMovies = [...movies]
      .filter(movie => reviews.some(r => r.movieId === movie.id))
      .sort((a, b) => {
        const aCount = reviews.filter(r => r.movieId === a.id).length;
        const bCount = reviews.filter(r => r.movieId === b.id).length;
        return bCount - aCount;
      });
  } else if (selectedGenre) {
    filteredMovies = movies.filter(movie => movie.genre.includes(selectedGenre));
  }
  // Always apply search
  if (searchQuery) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black transition-colors duration-300">
      <header className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 shadow-xl sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Film className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  CineRate
                </h1>
                <p className="text-red-200 text-sm">Your Ultimate Movie Review Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-4 mt-2 sm:mt-0">
              <button
                onClick={() => setShowWatchlist(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 bg-white text-red-700 border border-red-400 shadow hover:bg-red-100"
                title="View Watchlist"
              >
                <Bookmark className="w-4 h-4" />
                Watchlist
                {watchlist.length > 0 && (
                  <span className="ml-1 bg-red-400 text-white rounded-full px-2 py-0.5 text-xs font-bold">{watchlist.length}</span>
                )}
              </button>
              {comparisonMovies.length === 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 bg-white text-red-700 border border-red-400 shadow hover:bg-red-100"
                >
                  <GitCompare className="w-4 h-4" />
                  Compare ({comparisonMovies.length})
                </button>
              )}
            </div>
      {/* Watchlist Modal */}
      {showWatchlist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2 sm:px-0">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 relative border-2 border-red-700 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setShowWatchlist(false)}
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-red-500" />
              Your Watchlist
            </h2>
            {watchlist.length === 0 ? (
              <p className="text-gray-400">Your watchlist is empty.</p>
            ) : (
              <ul className="space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-2">
                {watchlist.map(id => {
                  const movie = movies.find(m => m.id === id);
                  if (!movie) return null;
                  return (
                    <li key={id} className="flex items-center gap-2 sm:gap-4 bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-700">
                      <img src={movie.poster} alt={movie.title} className="w-12 h-16 sm:w-14 sm:h-20 object-cover rounded-md border border-gray-700 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white">{movie.title}</div>
                        <div className="text-xs text-gray-400 mb-1">{movie.year} • {movie.genre.join(', ')}</div>
                        <button
                          onClick={() => setSelectedMovie(movie)}
                          className="text-xs text-red-400 hover:underline mr-3"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleToggleWatchlist(movie.id)}
                          className="text-xs text-gray-400 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="w-full max-w-xs relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-2 rounded-md border border-red-400/30 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-colors duration-200"
              />
            </div>
          </div>

          <div className="overflow-x-auto mt-4 -mx-2 pb-2">
            <div className="flex flex-nowrap gap-2 px-2 min-w-fit shadow-sm bg-gradient-to-b from-black/30 to-transparent rounded-lg">
              <button
                key="all"
                onClick={() => {
                  setSelectedGenre(null);
                  document.getElementById('movie-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  !selectedGenre
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All Movies
              </button>
              {specialFilters.map(f => (
                <button
                  key={f.value}
                  onClick={() => {
                    setSelectedGenre(selectedGenre === f.value ? null : f.value);
                    document.getElementById('movie-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedGenre === f.value
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
              {allGenres.slice(0, 8).map(genre => (
                <button
                  key={genre}
                  onClick={() => {
                    setSelectedGenre(selectedGenre === genre ? null : genre);
                    document.getElementById('movie-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedGenre === genre
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>


  <main className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      {badgeNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg text-base sm:text-lg font-semibold flex items-center gap-2 sm:gap-3 animate-fadeIn">
             {badgeNotification.icons && badgeNotification.icons.map((icon, i) => (
               <span key={i} className="text-2xl drop-shadow">{icon}</span>
             ))}
             <span>{badgeNotification.message}</span>
          </div>
        )}

        {/* Movie of the Day Section */}
        {movieOfTheDay && (() => {
          const motd = movies.find(m => m.id === movieOfTheDay);
          if (!motd) return null;
          const motdReviews = reviews.filter(r => r.movieId === motd.id);
          const avgRating = motdReviews.length > 0 ? (motdReviews.reduce((sum, r) => sum + r.rating, 0) / motdReviews.length).toFixed(1) : 'N/A';
          return (
            <section className="mb-4 sm:mb-8 w-full">
              <div className="flex flex-col md:flex-row items-center bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl shadow-lg border border-gray-800 overflow-hidden relative w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
                <img
                  src={motd.poster || 'https://via.placeholder.com/400x600?text=No+Image'}
                  alt={motd.title}
                  className="w-full md:w-40 h-28 sm:h-36 md:h-44 object-cover md:rounded-l-xl md:rounded-r-none rounded-t-xl md:rounded-t-none shadow border-r border-gray-800"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=No+Image'; }}
                />
                <div className="flex-1 p-2 sm:p-4 flex flex-col gap-2 sm:gap-3 relative w-full">
                  <div className="absolute inset-0 pointer-events-none rounded-3xl md:rounded-l-none md:rounded-r-3xl bg-black/40" />
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Film className="w-7 h-7 text-red-500" />
                      <span className="text-lg font-bold text-red-400 tracking-wide uppercase drop-shadow">Movie of the Day</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-1 drop-shadow-lg">{motd.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {motd.genre.map(g => (
                        <span key={g} className="px-3 py-1 bg-red-900/80 text-red-200 text-xs rounded-full border border-red-700/40 drop-shadow">{g}</span>
                      ))}
                    </div>
                    <p className="text-gray-100 text-base mb-2 line-clamp-3 drop-shadow-lg">{motd.description}</p>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-white font-semibold drop-shadow">{motd.year}</span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold drop-shadow"><svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 fill-amber-400' viewBox='0 0 24 24'><path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/></svg>{avgRating}</span>
                      <span className="text-gray-300 text-sm drop-shadow">({motdReviews.length} review{motdReviews.length !== 1 ? 's' : ''})</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-gray-200 text-sm mb-2">
                      <span>Cast:</span>
                      {motd.cast.map(c => <span key={c} className="bg-red-800/80 px-2 py-0.5 rounded-full drop-shadow">{c}</span>)}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2 w-full">
                      <button
                        title={watchlist.includes(motd.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        onClick={() => handleToggleWatchlist(motd.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border shadow ${watchlist.includes(motd.id) ? 'bg-red-400 text-white border-red-400' : 'bg-white text-red-700 border-red-400 hover:bg-red-100'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${watchlist.includes(motd.id) ? 'fill-white' : 'fill-none'}`} viewBox="0 0 24 24"><path d="M19 21 12 17.27 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {watchlist.includes(motd.id) ? 'In Watchlist' : 'Add to Watchlist'}
                      </button>
                      <button
                        title="Like Movie"
                        onClick={() => handleLikeMovie(motd.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 bg-white text-red-700 border border-red-400 hover:bg-red-100 shadow"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        {movieLikes[motd.id] || 0}
                      </button>
                      <button
                        onClick={() => setSelectedMovie(motd)}
                        className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 drop-shadow-lg text-xs sm:text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Show badges/leaderboard if 'All Movies' or no filter is selected */}
        {(!selectedGenre || selectedGenre === '') && (
          <>
            {currentUser && userBadges.some(b => b.earned) && (
              <div className="mb-8">
                <BadgeDisplay badges={userBadges} />
              </div>
            )}
            {reviews.length > 0 && (
              <div className="mb-8">
                <Leaderboard reviews={reviews} />
              </div>
            )}
          </>
        )}

        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {selectedGenre ? `${selectedGenre} Movies` : 'All Movies'}
          </h2>
          <p className="text-gray-400">
            {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
            {comparisonMovies.length > 0 && ` • ${comparisonMovies.length} selected for comparison`}
          </p>
        </div>

  <div id="movie-grid" className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="relative">
              {comparisonMovies.length < 2 && (
                <button
                  onClick={() => handleComparisonToggle(movie)}
                  className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    comparisonMovies.find(m => m.id === movie.id)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-900/90 text-white hover:bg-gray-800/90'
                  }`}
                >
                  {comparisonMovies.find(m => m.id === movie.id) ? '✓ Selected' : 'Compare'}
                </button>
              )}

              <MovieCard
                movie={movie}
                reviews={reviews}
                onViewDetails={() => setSelectedMovie(movie)}
                isMovieOfTheDay={movie.id === movieOfTheDay}
                isInWatchlist={watchlist.includes(movie.id)}
                onToggleWatchlist={handleToggleWatchlist}
                likeCount={movieLikes[movie.id] || 0}
                onLikeMovie={handleLikeMovie}
              />
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              No movies found matching your criteria.
            </p>
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          reviews={reviews}
          onClose={() => setSelectedMovie(null)}
          onAddReview={handleAddReview}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
          onLikeReview={handleLikeReview}
          currentUser={currentUser}
          reviewLikes={reviewLikes}
        />
      )}

      {showComparison && comparisonMovies.length === 2 && (
        <ComparisonModal
          movie1={comparisonMovies[0]}
          movie2={comparisonMovies[1]}
          reviews={reviews}
          onClose={() => {
            setShowComparison(false);
            setComparisonMovies([]);
          }}
        />
      )}
    </div>
  );
}

export default App;
