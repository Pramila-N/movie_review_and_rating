import { Badge, Review } from '../types';

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first-review',
    name: 'First Review',
    icon: '⭐',
    description: 'Write your first review',
    earned: false
  },
  {
    id: 'five-ratings',
    name: 'Movie Buff',
    icon: '🎯',
    description: 'Rate 5 different movies',
    earned: false
  },
  {
    id: 'ten-comments',
    name: 'Critic',
    icon: '📝',
    description: 'Write 10 reviews',
    earned: false
  },
  {
    id: 'perfect-score',
    name: 'Perfectionist',
    icon: '🌟',
    description: 'Give a 5-star rating',
    earned: false
  },
  {
    id: 'diverse-taste',
    name: 'Genre Explorer',
    icon: '🎭',
    description: 'Review movies from 5 different genres',
    earned: false
  }
];

export const checkBadges = (reviews: Review[], username: string): Badge[] => {
  const userReviews = reviews.filter(r => r.username === username);
  const badges = [...AVAILABLE_BADGES];

  if (userReviews.length > 0) {
    badges.find(b => b.id === 'first-review')!.earned = true;
  }

  const uniqueMovies = new Set(userReviews.map(r => r.movieId));
  if (uniqueMovies.size >= 5) {
    badges.find(b => b.id === 'five-ratings')!.earned = true;
  }

  if (userReviews.length >= 10) {
    badges.find(b => b.id === 'ten-comments')!.earned = true;
  }

  if (userReviews.some(r => r.rating === 5)) {
    badges.find(b => b.id === 'perfect-score')!.earned = true;
  }

  return badges;
};
