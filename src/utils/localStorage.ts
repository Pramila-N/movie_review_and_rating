import { Review, UserPreferences, Badge } from '../types';

const STORAGE_KEYS = {
  REVIEWS: 'movieReviews',
  PREFERENCES: 'userPreferences',
  MOVIE_OF_DAY: 'movieOfTheDay',
  BADGES: 'userBadges',
  REVIEW_LIKES: 'reviewLikes'
};

export const loadReviews = (): Review[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  return stored ? JSON.parse(stored) : [];
};

export const saveReviews = (reviews: Review[]): void => {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
};

export const loadPreferences = (): UserPreferences => {
  const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  return stored ? JSON.parse(stored) : { theme: 'light', selectedAvatar: '😊' };
};

export const savePreferences = (preferences: UserPreferences): void => {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
};

export const getMovieOfTheDay = (): { movieId: string; date: string } | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.MOVIE_OF_DAY);
  return stored ? JSON.parse(stored) : null;
};

export const setMovieOfTheDay = (movieId: string, date: string): void => {
  localStorage.setItem(STORAGE_KEYS.MOVIE_OF_DAY, JSON.stringify({ movieId, date }));
};

export const loadBadges = (): Badge[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.BADGES);
  return stored ? JSON.parse(stored) : [];
};

export const saveBadges = (badges: Badge[]): void => {
  localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
};

export const loadReviewLikes = (): Record<string, string[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.REVIEW_LIKES);
  return stored ? JSON.parse(stored) : {};
};

export const saveReviewLikes = (likes: Record<string, string[]>): void => {
  localStorage.setItem(STORAGE_KEYS.REVIEW_LIKES, JSON.stringify(likes));
};
