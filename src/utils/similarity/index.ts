
import { calculateJaccardSimilarity } from './jaccard';
import { calculateTFIDF } from './tfidf';

/**
 * Choose the best similarity score based on multiple algorithms
 */
export const calculateTextSimilarity = (text1: string, text2: string): number => {
  const jaccardScore = calculateJaccardSimilarity(text1, text2);
  const tfidfScore = calculateTFIDF(text1, text2);
  
  // Enhance the method selection:
  // - When one algorithm shows high similarity, trust it more (bias toward detecting plagiarism)
  // - Apply a small boost to better represent actual similarity
  
  // Get highest score and apply a boost for better detection
  const highestScore = Math.max(jaccardScore, tfidfScore);
  
  // Apply a small boost to scores above a threshold to better detect plagiarism
  if (highestScore > 30) {
    // Apply logarithmic scaling boost (more boost for higher scores)
    const boost = 5 + Math.log10(highestScore) * 10;
    return Math.min(highestScore + boost, 95);
  }
  
  return highestScore;
};

export { calculateJaccardSimilarity, calculateTFIDF };
