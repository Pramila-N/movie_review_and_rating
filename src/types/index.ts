export interface Movie {
  id: string;
  title: string;
  genre: string[];
  year: number;
  poster: string;
  description: string;
  cast: string[];
}

export interface Review {
  id: string;
  movieId: string;
  username: string;
  avatar: string;
  rating: number;
  comment: string;
  timestamp: number;
  likes: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface UserStats {
  username: string;
  reviewCount: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  selectedAvatar: string;
}
