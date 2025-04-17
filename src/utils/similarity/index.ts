
import { calculateJaccardSimilarity } from './jaccard';
import { calculateTFIDF } from './tfidf';

/**
 * Choose the best similarity score based on multiple algorithms
 */
export const calculateTextSimilarity = (text1: string, text2: string): number => {
  const jaccardScore = calculateJaccardSimilarity(text1, text2);
  const tfidfScore = calculateTFIDF(text1, text2);
  
  // Return the higher score as it indicates better match detection
  return Math.max(jaccardScore, tfidfScore);
};

export { calculateJaccardSimilarity, calculateTFIDF };
