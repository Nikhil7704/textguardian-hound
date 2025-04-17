
import { Source } from "@/components/SourceLink";
import { PlagiarismMethodType, DatabaseSourceType } from "@/components/PlagiarismMethod";
import { SearchApiConfig } from "./googleSearchApi";
import { fetchApiSearchResults } from "./search/searchHandler";
import { checkAgainstDatabase } from "./database/databaseHandler";
import { checkAgainstUploadedDocuments } from "./fileProcessing/fileHandler";
import { processUploadedFiles } from "./textProcessing";

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
  
  // Process uploaded files first if there are any
  let contentToCheck = text;
  
  if (uploadedFiles.length > 0) {
    // Extract and add text from uploaded files
    const extractedText = await processUploadedFiles(uploadedFiles);
    
    // If user provided no text but uploaded files, use the extracted text
    // If user provided both text and files, append the extracted text
    if (text.trim().length === 0) {
      contentToCheck = extractedText;
    } else {
      contentToCheck = `${text}\n\n${extractedText}`;
    }
  }
  
  // Skip processing if no content to check
  if (!contentToCheck || contentToCheck.trim().length === 0) {
    return { sources: [], plagiarismPercentage: 0 };
  }
  
  if (method === "searchEngine") {
    // Use real or simulated API search based on availability of searchApiConfig
    sources = await fetchApiSearchResults(contentToCheck, searchApiConfig);
    
    // Check against uploaded documents if present (different from the documents being checked)
    if (studentFiles.length > 0) {
      const uploadedResults = await checkAgainstUploadedDocuments(contentToCheck, studentFiles);
      sources = [...sources, ...uploadedResults];
    }
  } else {
    // For database method, use the improved database comparison
    sources = checkAgainstDatabase(contentToCheck, databaseSourceType);
    
    // Check against student files if provided
    if (studentFiles.length > 0) {
      const studentResults = await checkAgainstUploadedDocuments(contentToCheck, studentFiles);
      sources = [...sources, ...studentResults];
    }
  }
  
  // Remove duplicate sources by URL
  sources = sources.filter((source, index, self) =>
    index === self.findIndex((s) => s.url === source.url)
  );
  
  // Dramatically enhanced plagiarism percentage calculation
  let plagiarismPercentage = 0;
  
  if (sources.length > 0) {
    // Completely revised algorithm for more accurate and stronger plagiarism detection:
    // 1. Much higher weighting for top matches
    // 2. Aggressive scaling based on source count
    // 3. Higher baseline for any matches at all
    
    // Sort sources by match percentage (highest first)
    sources.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Get top 3 sources (or fewer if less available)
    const topSources = sources.slice(0, 3);
    
    // Calculate weighted average with stronger weights for top sources
    const weights = [0.7, 0.3, 0.2]; // Increased weights for 1st, 2nd, and 3rd sources
    let weightSum = 0;
    let weightedScore = 0;
    
    topSources.forEach((source, index) => {
      const weight = weights[index] || 0.15; // Use higher weight for any sources beyond top 3
      weightedScore += source.matchPercentage * weight;
      weightSum += weight;
    });
    
    // Normalize based on actual weights used
    let baseScore = weightSum > 0 ? weightedScore / weightSum : 0;
    
    // Apply much stronger source count multiplier (more sources = higher plagiarism)
    // Dramatic scaling based on number of sources found
    const sourceCountMultiplier = Math.min(1.25 + (sources.length / 5), 1.8);
    
    // Calculate final percentage with enhanced scaling
    plagiarismPercentage = Math.min(
      Math.round(baseScore * sourceCountMultiplier),
      95 // Cap at 95% as requested
    );
    
    // Set much higher minimum thresholds based on number of sources
    if (sources.length >= 3) {
      plagiarismPercentage = Math.max(plagiarismPercentage, 70); // High minimum for 3+ sources
    } else if (sources.length >= 2) {
      plagiarismPercentage = Math.max(plagiarismPercentage, 55); // Medium-high minimum for 2 sources
    } else if (sources.length >= 1) {
      // For a single source, base minimum on its match percentage
      const sourceMatchPercentage = sources[0].matchPercentage;
      const minimumScore = Math.max(sourceMatchPercentage, 40); // At least 40% for any single source
      plagiarismPercentage = Math.max(plagiarismPercentage, minimumScore);
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
