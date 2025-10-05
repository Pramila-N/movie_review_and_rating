const positiveWords = [
  'amazing', 'excellent', 'great', 'wonderful', 'fantastic', 'awesome', 'love', 'loved',
  'brilliant', 'outstanding', 'perfect', 'masterpiece', 'beautiful', 'incredible',
  'superb', 'best', 'favorite', 'phenomenal', 'breathtaking', 'stunning', 'impressive',
  'entertaining', 'enjoyable', 'delightful', 'captivating', 'thrilling', 'compelling'
];

const negativeWords = [
  'terrible', 'awful', 'bad', 'worst', 'horrible', 'disappointing', 'boring', 'waste',
  'poor', 'mediocre', 'dull', 'weak', 'failed', 'mess', 'disaster', 'hate', 'hated',
  'tedious', 'confusing', 'pointless', 'unwatchable', 'overrated', 'forgettable'
];

export const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const lowerText = text.toLowerCase();

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};
