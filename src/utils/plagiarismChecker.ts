
import { Source } from "@/components/SourceLink";
import { PlagiarismMethodType, DatabaseSourceType } from "@/components/PlagiarismMethod";
import { SearchApiConfig } from "./googleSearchApi";
import { fetchApiSearchResults } from "./search/searchHandler";
import { checkAgainstDatabase } from "./database/databaseHandler";
import { checkAgainstUploadedDocuments } from "./fileProcessing/fileHandler";

// Main function to check plagiarism with enhanced accuracy
export const checkPlagiarism = async (
  text: string,
  method: PlagiarismMethodType,
  options: {
    databaseSourceType?: DatabaseSourceType;
    uploadedFiles?: File[];
    studentFiles?: File[];
    searchApiConfig?: SearchApiConfig;
  } = {}
): Promise<{ sources: Source[]; plagiarismPercentage: number }> => {
  // Simulate a processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let sources: Source[] = [];
  const { 
    databaseSourceType = 'research', 
    uploadedFiles = [], 
    studentFiles = [],
    searchApiConfig
  } = options;
  
  if (method === "searchEngine") {
    // Use real or simulated API search based on availability of searchApiConfig
    sources = await fetchApiSearchResults(text, searchApiConfig);
    
    // Process uploaded files
    if (uploadedFiles.length > 0) {
      // Check against uploaded documents
      const uploadedResults = await checkAgainstUploadedDocuments(text, uploadedFiles);
      sources = [...sources, ...uploadedResults];
    }
  } else {
    // For database method, use the improved database comparison
    sources = checkAgainstDatabase(text, databaseSourceType);
    
    // Process uploaded files
    if (uploadedFiles.length > 0) {
      // Check against uploaded documents
      const uploadedResults = await checkAgainstUploadedDocuments(text, uploadedFiles);
      sources = [...sources, ...uploadedResults];
    }
    
    // Check against student files if provided
    if (studentFiles.length > 0) {
      const studentResults = await checkAgainstUploadedDocuments(text, studentFiles);
      sources = [...sources, ...studentResults];
    }
  }
  
  // Remove duplicate sources by URL
  sources = sources.filter((source, index, self) =>
    index === self.findIndex((s) => s.url === source.url)
  );
  
  // Enhanced plagiarism percentage calculation
  let plagiarismPercentage = 0;
  
  if (sources.length > 0) {
    // Improved algorithm for more accurate plagiarism detection:
    // 1. Base percentage on number of sources and their match percentages
    // 2. Weigh higher matches more significantly
    // 3. Scale up based on source count (more sources = higher plagiarism likelihood)
    
    // Sort sources by match percentage (highest first)
    sources.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Get top 3 sources (or fewer if less available)
    const topSources = sources.slice(0, 3);
    
    // Calculate weighted average with diminishing weights (first source has highest weight)
    const weights = [0.6, 0.25, 0.15]; // Weights for 1st, 2nd, and 3rd sources
    let weightSum = 0;
    let weightedScore = 0;
    
    topSources.forEach((source, index) => {
      const weight = weights[index] || 0.1; // Use 0.1 weight for any sources beyond top 3
      weightedScore += source.matchPercentage * weight;
      weightSum += weight;
    });
    
    // Normalize based on actual weights used
    let baseScore = weightSum > 0 ? weightedScore / weightSum : 0;
    
    // Apply source count multiplier (more sources = higher plagiarism)
    // Scale up the score based on number of sources, but with diminishing returns
    const sourceCountMultiplier = Math.min(1 + (sources.length / 10), 1.5);
    
    // Calculate final percentage with scaling
    plagiarismPercentage = Math.min(
      Math.round(baseScore * sourceCountMultiplier),
      95 // Cap at 95% as requested
    );
    
    // Ensure minimum plagiarism score if multiple sources are found
    if (sources.length >= 3 && plagiarismPercentage < 50) {
      plagiarismPercentage = Math.max(plagiarismPercentage, 50);
    } else if (sources.length >= 2 && plagiarismPercentage < 40) {
      plagiarismPercentage = Math.max(plagiarismPercentage, 40);
    } else if (sources.length >= 1 && plagiarismPercentage < 30) {
      plagiarismPercentage = Math.max(plagiarismPercentage, 30);
    }
  }
  
  return {
    sources: sources.slice(0, 5), // Return top 5 sources
    plagiarismPercentage
  };
};

// Export other utility functions that might be needed elsewhere
export { calculateTextSimilarity } from './similarity';
export { splitTextIntoChunks } from './textProcessing';
