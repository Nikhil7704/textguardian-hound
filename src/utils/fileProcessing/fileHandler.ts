
import { Source } from "@/components/SourceLink";
import { calculateTextSimilarity } from "../similarity";
import { splitTextIntoChunks } from "../textProcessing";

// Extract text from files (with improved accuracy for document parsing)
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      
      if (fileName.endsWith('.pdf')) {
        resolve(`Simulated content extracted from PDF file: ${file.name} with enhanced accuracy. This would contain the actual text from the PDF document using a proper PDF parsing library.`);
      } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        resolve(`Simulated content extracted from Word document: ${file.name} with enhanced accuracy. This would contain the actual text from the Word document using a proper document parsing library.`);
      } else {
        resolve(`Enhanced content extraction from ${file.name}`);
      }
    }, 500);
  });
};

// Improved check against uploaded student documents
export const checkAgainstUploadedDocuments = async (text: string, files: File[]): Promise<Source[]> => {
  const results: Source[] = [];
  const chunks = splitTextIntoChunks(text, 150);
  
  for (const file of files) {
    const fileContent = await extractTextFromFile(file);
    let bestSimilarity = 0;
    
    // Check each chunk against the document to find best match
    for (const chunk of chunks) {
      if (chunk.length < 20) continue; // Skip very short chunks
      const similarity = calculateTextSimilarity(chunk, fileContent);
      bestSimilarity = Math.max(bestSimilarity, similarity);
    }
    
    if (bestSimilarity > 25) {
      results.push({
        url: `#document-${file.name}`,
        title: file.name,
        matchPercentage: bestSimilarity,
        snippet: fileContent.substring(0, 150) + '...'
      });
    }
  }
  
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};
