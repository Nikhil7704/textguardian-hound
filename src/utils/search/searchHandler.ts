
import { Source } from "@/components/SourceLink";
import { SearchApiConfig, searchGoogleApi, enhanceSearchResults } from "../googleSearchApi";
import { simulateSearchApiResults } from "./simulatedSearch";
import { splitTextIntoChunks } from "../textProcessing";
import { calculateTextSimilarity } from "../similarity";

// Real API search results from Google Custom Search API
export const fetchApiSearchResults = async (
  query: string, 
  searchApiConfig?: SearchApiConfig
): Promise<Source[]> => {
  // Skip API call if no configuration is provided
  if (!searchApiConfig?.apiKey || !searchApiConfig?.searchEngineId) {
    console.log("Using simulated search results as no API key was provided");
    return simulateSearchApiResults(query);
  }

  try {
    // Split the query into smaller chunks for more accurate search
    const chunks = splitTextIntoChunks(query, 200);
    console.log(`Searching with ${chunks.length} query chunks using Google API`);
    
    // Process each chunk with actual Google API search
    const allResults: Source[] = [];
    
    // Only use first few chunks to minimize API usage and ensure reasonable response time
    for (const chunk of chunks.slice(0, 3)) {
      // Get actual results from Google API for this chunk
      const chunkResults = await searchGoogleApi(chunk, searchApiConfig);
      
      // Calculate match percentages based on similarity algorithms
      const enhancedResults = enhanceSearchResults(
        chunkResults,
        query,
        calculateTextSimilarity
      );
      
      allResults.push(...enhancedResults);
    }
    
    // Remove duplicates by URL
    const uniqueResults = allResults.filter((result, index, self) =>
      index === self.findIndex((r) => r.url === result.url)
    );
    
    // Sort by match percentage (descending)
    return uniqueResults
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5); // Return top 5 results
  } catch (error) {
    console.error("Error fetching search results:", error);
    // Fallback to simulated results on error
    console.log("Falling back to simulated search results due to API error");
    return simulateSearchApiResults(query);
  }
};
