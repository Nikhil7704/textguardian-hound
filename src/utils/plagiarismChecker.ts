
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
  
  // Calculate a weighted plagiarism percentage
  let plagiarismPercentage = 0;
  if (sources.length > 0) {
    // Weight the top matches more heavily
    const totalWeight = sources.reduce((sum, _, index) => sum + (sources.length - index), 0);
    const weightedSum = sources.reduce((sum, source, index) => {
      const weight = (sources.length - index) / totalWeight;
      return sum + (source.matchPercentage * weight);
    }, 0);
    
    plagiarismPercentage = Math.min(Math.round(weightedSum), 92); // Cap at 92% as requested
  }
  
  return {
    sources: sources.slice(0, 5), // Return top 5 sources
    plagiarismPercentage
  };
};

// Export other utility functions that might be needed elsewhere
export { calculateTextSimilarity } from './similarity';
export { splitTextIntoChunks } from './textProcessing';
