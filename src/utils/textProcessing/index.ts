
/**
 * Utility functions for processing text
 */

// Split text into smaller, more manageable chunks for better analysis
export const splitTextIntoChunks = (text: string, chunkSize: number = 200): string[] => {
  if (!text || text.length === 0) return [];
  
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.length > 20) { // Only include chunks with meaningful content
      chunks.push(chunk);
    }
  }
  
  return chunks;
};

// Extract text content from uploaded files (simulated in this implementation)
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

// Process all files to extract their text content
export const processUploadedFiles = async (files: File[]): Promise<string> => {
  if (!files || files.length === 0) return '';
  
  const fileContents: string[] = [];
  
  for (const file of files) {
    const content = await extractTextFromFile(file);
    fileContents.push(content);
  }
  
  return fileContents.join('\n\n');
};
