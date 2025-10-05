import { Badge } from '../types';
import { Award } from 'lucide-react';

interface BadgeDisplayProps {
  badges: Badge[];
}

export const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  const earnedBadges = badges.filter(b => b.earned);

  if (earnedBadges.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-red-900/30">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-7 h-7 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Your Achievements</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {earnedBadges.map(badge => (
          <div
            key={badge.id}
            className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-lg p-4 text-center transform transition-all duration-200 hover:scale-105 border-2 border-red-700"
          >
            <div className="text-4xl mb-2">{badge.icon}</div>
            <h3 className="font-semibold text-white text-sm mb-1">{badge.name}</h3>
            <p className="text-xs text-gray-400">{badge.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-red-900/30">
        <p className="text-sm text-gray-400 text-center">
          {earnedBadges.length} of {badges.length} badges earned
        </p>
      </div>
    </div>
  );
};
