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
  saveReviewLikes
} from './utils/localStorage';
import { analyzeSentiment } from './utils/sentiment';
import { checkBadges, AVAILABLE_BADGES } from './utils/badges';
import { Film, Moon, Sun, GitCompare, Search, Filter } from 'lucide-react';

function App() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({ theme: 'light', selectedAvatar: '😊' });
  const [movieOfTheDay, setMovieOfDayState] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [reviewLikes, setReviewLikes] = useState<Record<string, string[]>>({});
  const [userBadges, setUserBadges] = useState(AVAILABLE_BADGES);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonMovies, setComparisonMovies] = useState<Movie[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const storedReviews = loadReviews();
    const storedPreferences = loadPreferences();
    const storedLikes = loadReviewLikes();

    setReviews(storedReviews);
    setPreferences(storedPreferences);
    setReviewLikes(storedLikes);

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

  useEffect(() => {
    if (currentUser) {
      const badges = checkBadges(reviews, currentUser);
      setUserBadges(badges);
    }
  }, [reviews, currentUser]);

  const toggleTheme = () => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    const newPreferences = { ...preferences, theme: newTheme };
    setPreferences(newPreferences);
    savePreferences(newPreferences);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  const filteredMovies = movies.filter(movie => {
    const matchesGenre = !selectedGenre || movie.genre.includes(selectedGenre);
    const matchesSearch = !searchQuery ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black transition-colors duration-300">
      <header className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 shadow-xl sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  CineRate
                </h1>
                <p className="text-red-200 text-sm">Your Ultimate Movie Review Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {comparisonMovies.length === 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <GitCompare className="w-5 h-5" />
                  Compare ({comparisonMovies.length})
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors duration-200"
              >
                {preferences.theme === 'light' ? (
                  <Moon className="w-5 h-5 text-white" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-red-400/30 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-red-400" />
              <select
                value={selectedGenre || ''}
                onChange={(e) => setSelectedGenre(e.target.value || null)}
                className="px-4 py-2.5 rounded-lg border border-red-400/30 bg-gray-900 text-white focus:ring-2 focus:ring-red-500 transition-colors duration-200"
              >
                <option value="">All Genres</option>
                {allGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {allGenres.slice(0, 8).map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {selectedGenre ? `${selectedGenre} Movies` : 'All Movies'}
          </h2>
          <p className="text-gray-400">
            {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
            {comparisonMovies.length > 0 && ` • ${comparisonMovies.length} selected for comparison`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}

export default App;
