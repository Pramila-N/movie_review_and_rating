import { Review } from '../types';
import { Trophy, Award, Medal } from 'lucide-react';

interface LeaderboardProps {
  reviews: Review[];
}

export const Leaderboard = ({ reviews }: LeaderboardProps) => {
  const userStats = reviews.reduce((acc, review) => {
    if (!acc[review.username]) {
      acc[review.username] = {
        username: review.username,
        avatar: review.avatar,
        count: 0,
        totalLikes: 0,
        avgRating: 0,
        totalRating: 0
      };
    }
    acc[review.username].count++;
    acc[review.username].totalLikes += review.likes;
    acc[review.username].totalRating += review.rating;
    acc[review.username].avgRating = acc[review.username].totalRating / acc[review.username].count;
    return acc;
  }, {} as Record<string, { username: string; avatar: string; count: number; totalLikes: number; avgRating: number; totalRating: number }>);

  const topReviewers = Object.values(userStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (topReviewers.length === 0) {
    return null;
  }

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 1:
        return <Award className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  const getMedalClass = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-amber-400 to-amber-500';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 2:
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-red-900/30">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-7 h-7 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Top Reviewers</h2>
      </div>

      <div className="space-y-3">
        {topReviewers.map((user, index) => (
          <div
            key={user.username}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:scale-102 ${
              index < 3
                ? 'bg-gradient-to-r from-gray-800 to-gray-800/80 border-2 border-red-700'
                : 'bg-gray-800/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getMedalClass(index)}`}>
              {index < 3 ? (
                getMedalIcon(index)
              ) : (
                <span className="font-bold text-gray-300">#{index + 1}</span>
              )}
            </div>

            <div className="text-3xl">{user.avatar}</div>

            <div className="flex-1">
              <h3 className="font-semibold text-white">{user.username}</h3>
              <p className="text-sm text-gray-400">
                {user.count} review{user.count !== 1 ? 's' : ''} • {user.totalLikes} like{user.totalLikes !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-amber-500">{user.avgRating.toFixed(1)}⭐</div>
              <p className="text-xs text-gray-400">avg rating</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
