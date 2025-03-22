import { Source } from "@/components/SourceLink";
import { PlagiarismMethodType } from "@/components/PlagiarismMethod";
import type { DatabaseSourceType } from "@/components/PlagiarismMethod";

// TF-IDF implementation for better text similarity matching
const calculateTFIDF = (text1: string, text2: string): number => {
  // Convert texts to lowercase and split into words
  const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  // Calculate term frequency for both documents
  const tf1: Record<string, number> = {};
  const tf2: Record<string, number> = {};
  
  words1.forEach(word => {
    tf1[word] = (tf1[word] || 0) + 1;
  });
  
  words2.forEach(word => {
    tf2[word] = (tf2[word] || 0) + 1;
  });
  
  // Get all unique terms
  const allTerms = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
  
  // Calculate document frequency
  const df: Record<string, number> = {};
  allTerms.forEach(term => {
    df[term] = ((term in tf1) ? 1 : 0) + ((term in tf2) ? 1 : 0);
  });
  
  // Normalize term frequencies
  const maxTf1 = Math.max(...Object.values(tf1), 1);
  const maxTf2 = Math.max(...Object.values(tf2), 1);
  
  const normalizedTf1: Record<string, number> = {};
  const normalizedTf2: Record<string, number> = {};
  
  allTerms.forEach(term => {
    normalizedTf1[term] = term in tf1 ? tf1[term] / maxTf1 : 0;
    normalizedTf2[term] = term in tf2 ? tf2[term] / maxTf2 : 0;
  });
  
  // Calculate TF-IDF vectors
  const tfidf1: Record<string, number> = {};
  const tfidf2: Record<string, number> = {};
  
  allTerms.forEach(term => {
    const idf = Math.log(2 / df[term]);
    tfidf1[term] = normalizedTf1[term] * idf;
    tfidf2[term] = normalizedTf2[term] * idf;
  });
  
  // Calculate cosine similarity
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  allTerms.forEach(term => {
    dotProduct += tfidf1[term] * tfidf2[term];
    magnitude1 += tfidf1[term] * tfidf1[term];
    magnitude2 += tfidf2[term] * tfidf2[term];
  });
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  // Calculate and return similarity percentage
  const similarity = dotProduct / (magnitude1 * magnitude2);
  return Math.min(Math.round(similarity * 100), 92); // Cap at 92% as requested
};

// Enhanced Jaccard similarity implementation
const calculateJaccardSimilarity = (text1: string, text2: string): number => {
  // Tokenize text into n-grams (3-grams)
  const getNGrams = (text: string, n: number) => {
    const tokens = text.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const ngrams = new Set<string>();
    
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.add(tokens.slice(i, i + n).join(' '));
    }
    
    return ngrams;
  };
  
  const ngrams1 = getNGrams(text1, 3);
  const ngrams2 = getNGrams(text2, 3);
  
  const intersection = new Set([...ngrams1].filter(ngram => ngrams2.has(ngram)));
  const union = new Set([...ngrams1, ...ngrams2]);
  
  if (union.size === 0) return 0;
  
  // Calculate and return similarity percentage
  const similarity = intersection.size / union.size;
  return Math.min(Math.round(similarity * 100), 92); // Cap at 92% as requested
};

// Choose the best similarity score based on multiple algorithms
const calculateTextSimilarity = (text1: string, text2: string): number => {
  const jaccardScore = calculateJaccardSimilarity(text1, text2);
  const tfidfScore = calculateTFIDF(text1, text2);
  
  // Return the higher score as it indicates better match detection
  return Math.max(jaccardScore, tfidfScore);
};

// More realistic API search results based on the Bing Search API model
const fetchApiSearchResults = async (query: string): Promise<Source[]> => {
  // Split the query into smaller chunks for more accurate search
  const chunks = splitTextIntoChunks(query, 200);
  console.log(`Searching with ${chunks.length} query chunks`);
  
  // Process each chunk with a simulated Bing API search
  const allResults: Source[] = [];
  
  for (const chunk of chunks.slice(0, 3)) { // Limit to first 3 chunks for demo
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get simulated results for this chunk
    const chunkResults = simulateSearchApiResults(chunk);
    allResults.push(...chunkResults);
  }
  
  // Remove duplicates by URL
  const uniqueResults = allResults.filter((result, index, self) =>
    index === self.findIndex((r) => r.url === result.url)
  );
  
  // Sort by match percentage (descending)
  return uniqueResults
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 5); // Return top 5 results
};

// Split text into manageable chunks for search
const splitTextIntoChunks = (text: string, chunkSize: number): string[] => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: string[] = [];
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
};

// Simulate search API results with more realistic data
const simulateSearchApiResults = (query: string): Source[] => {
  const normalizedQuery = query.toLowerCase();
  
  // Common plagiarism topics with realistic data
  if (normalizedQuery.includes("machine learning") || normalizedQuery.includes("artificial intelligence")) {
    return [
      {
        url: "https://en.wikipedia.org/wiki/Machine_learning",
        title: "Machine learning - Wikipedia",
        matchPercentage: Math.min(75 + Math.floor(Math.random() * 17), 92),
        snippet: "Machine learning is a branch of artificial intelligence and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy."
      },
      {
        url: "https://www.ibm.com/cloud/learn/machine-learning",
        title: "What is Machine Learning? | IBM",
        matchPercentage: Math.min(65 + Math.floor(Math.random() * 20), 92),
        snippet: "Machine learning is a form of AI that enables a system to learn from data rather than through explicit programming."
      }
    ];
  }
  
  if (normalizedQuery.includes("climate change") || normalizedQuery.includes("global warming")) {
    return [
      {
        url: "https://www.un.org/en/climatechange",
        title: "Climate Change | United Nations",
        matchPercentage: Math.min(70 + Math.floor(Math.random() * 22), 92),
        snippet: "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change."
      },
      {
        url: "https://climate.nasa.gov/",
        title: "Climate Change: Vital Signs of the Planet – NASA",
        matchPercentage: Math.min(65 + Math.floor(Math.random() * 20), 92),
        snippet: "The current warming trend is of particular significance because it is unequivocally the result of human activity since the mid-20th century."
      }
    ];
  }
  
  if (normalizedQuery.includes("web development") || normalizedQuery.includes("frontend")) {
    return [
      {
        url: "https://developer.mozilla.org/en-US/docs/Learn",
        title: "Learn web development | MDN",
        matchPercentage: Math.min(68 + Math.floor(Math.random() * 20), 92),
        snippet: "Modern web development encompasses a variety of technologies and methodologies including responsive design, progressive web apps, and component-based architecture."
      },
      {
        url: "https://www.w3schools.com/",
        title: "W3Schools Online Web Tutorials",
        matchPercentage: Math.min(60 + Math.floor(Math.random() * 20), 92),
        snippet: "Web development refers to building, creating, and maintaining websites. It includes aspects such as web design, web publishing, web programming, and database management."
      }
    ];
  }
  
  // Generate some generic results for other queries
  return [
    {
      url: `https://example.com/result-${Math.floor(Math.random() * 1000)}`,
      title: `Search Result for "${query.substring(0, 30)}${query.length > 30 ? '...' : ''}"`,
      matchPercentage: Math.min(50 + Math.floor(Math.random() * 42), 92),
      snippet: `This is a simulated search result for your query. In a real implementation, this would be an actual matching passage from the web using Bing Search API. The text might contain terms like: ${normalizedQuery.split(' ').slice(0, 5).join(', ')}...`
    },
    {
      url: `https://example.org/result-${Math.floor(Math.random() * 1000)}`,
      title: `Related Information on "${query.substring(0, 25)}${query.length > 25 ? '...' : ''}"`,
      matchPercentage: Math.min(45 + Math.floor(Math.random() * 35), 92),
      snippet: `Another simulated result showing how the enhanced plagiarism detection would display found matches with TF-IDF and Jaccard similarity algorithms for improved accuracy.`
    }
  ];
};

// Simulated database of academic documents
const academicDatabase = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    content: "Machine learning is a branch of artificial intelligence and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy.",
    url: "https://example.com/academic/machine-learning-intro"
  },
  {
    id: 2,
    title: "Understanding Climate Change",
    content: "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels.",
    url: "https://example.com/academic/climate-change"
  },
  {
    id: 3,
    title: "The Impact of Social Media",
    content: "Social media has revolutionized communication and has significant implications for how people interact, consume information, and engage with the world around them.",
    url: "https://example.com/academic/social-media-impact"
  },
  {
    id: 4,
    title: "Modern Web Development Techniques",
    content: "Modern web development encompasses a variety of technologies and methodologies including responsive design, progressive web apps, and component-based architecture.",
    url: "https://example.com/academic/web-development"
  },
  {
    id: 5,
    title: "The Ethics of Artificial Intelligence",
    content: "As AI systems become more autonomous and sophisticated, ethical considerations surrounding their design, implementation, and regulation have become increasingly important.",
    url: "https://example.com/academic/ai-ethics"
  }
];

// Simulated student documents database
const studentDocumentsDatabase = [
  {
    id: 1,
    title: "Understanding Machine Learning",
    content: "Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention.",
    author: "Student A",
    course: "CS101",
    date: "2023-01-15"
  },
  {
    id: 2,
    title: "Global Warming and its Effects",
    content: "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels.",
    author: "Student B",
    course: "ENV200",
    date: "2023-02-22"
  },
  {
    id: 3,
    title: "Web Development Fundamentals",
    content: "Modern web development encompasses a variety of technologies and methodologies including responsive design, progressive web apps, and component-based architecture.",
    author: "Student C",
    course: "WEB101",
    date: "2023-03-10"
  }
];

// Simulated research papers database
const researchPapersDatabase = [
  {
    id: 1,
    title: "Advances in Neural Networks",
    content: "Neural networks have revolutionized machine learning by mimicking the way the human brain works. This paper explores recent advancements in neural network architectures and their applications.",
    authors: ["Dr. Smith, J.", "Dr. Johnson, A."],
    journal: "Journal of Machine Learning",
    year: 2022
  },
  {
    id: 2,
    title: "Climate Change: Current Evidence and Future Projections",
    content: "This paper presents an analysis of current evidence for climate change and provides projections for future climate scenarios based on various emissions pathways.",
    authors: ["Dr. Brown, R.", "Dr. Davis, S."],
    journal: "Environmental Science Review",
    year: 2021
  }
];

// Simulated educational content database
const educationalContentDatabase = [
  {
    id: 1,
    title: "Introduction to Programming",
    content: "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages.",
    source: "Khan Academy",
    level: "Beginner"
  },
  {
    id: 2,
    title: "Basic Chemistry Concepts",
    content: "Chemistry is the scientific study of matter and its properties, the changes it undergoes, and the energy involved in these processes.",
    source: "MIT OpenCourseWare",
    level: "Intermediate"
  }
];

// Simulated books and journals database
const booksJournalsDatabase = [
  {
    id: 1,
    title: "The History of Computing",
    content: "The history of computing is longer than the history of computing hardware and modern computing technology and includes the history of methods intended for pen and paper or for chalk and slate, with or without the aid of tables.",
    author: "Johnson, P.",
    publisher: "Tech Press",
    year: 2019
  },
  {
    id: 2,
    title: "Understanding Artificial Intelligence",
    content: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans or animals.",
    author: "Smith, A.",
    publisher: "Future Publishing",
    year: 2020
  }
];

// Get the appropriate database based on the source type
const getDatabaseBySourceType = (sourceType: DatabaseSourceType) => {
  switch (sourceType) {
    case 'research':
      return researchPapersDatabase;
    case 'educational':
      return educationalContentDatabase;
    case 'assignments':
      return studentDocumentsDatabase;
    case 'books':
      return booksJournalsDatabase;
    default:
      return academicDatabase;
  }
};

// Check text against the selected database with improved accuracy
const checkAgainstDatabase = (text: string, databaseSourceType: DatabaseSourceType = 'research'): Source[] => {
  const database = getDatabaseBySourceType(databaseSourceType);
  const results: Source[] = [];
  
  // Split text into chunks for more accurate comparison
  const chunks = splitTextIntoChunks(text, 150);
  
  database.forEach(document => {
    const documentContent = document.content;
    let bestSimilarity = 0;
    
    // Check each chunk against the document to find best match
    for (const chunk of chunks) {
      if (chunk.length < 20) continue; // Skip very short chunks
      const similarity = calculateTextSimilarity(chunk, documentContent);
      bestSimilarity = Math.max(bestSimilarity, similarity);
    }
    
    if (bestSimilarity > 30) {
      results.push({
        url: `https://example.com/document/${document.id}`,
        title: document.title,
        matchPercentage: bestSimilarity,
        snippet: documentContent.substring(0, 150) + '...'
      });
    }
  });
  
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

// Improved check against uploaded student documents
const checkAgainstUploadedDocuments = async (text: string, files: File[]): Promise<Source[]> => {
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

// Extract text from files (with improved accuracy for document parsing)
const extractTextFromFile = async (file: File): Promise<string> => {
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

// Main function to check plagiarism with enhanced accuracy
export const checkPlagiarism = async (
  text: string,
  method: PlagiarismMethodType,
  options: {
    databaseSourceType?: DatabaseSourceType;
    uploadedFiles?: File[];
    studentFiles?: File[];
  } = {}
): Promise<{ sources: Source[]; plagiarismPercentage: number }> => {
  // Simulate a processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let sources: Source[] = [];
  const { databaseSourceType = 'research', uploadedFiles = [], studentFiles = [] } = options;
  
  if (method === "searchEngine") {
    // For search engine method, use the enhanced API search simulation
    sources = await fetchApiSearchResults(text);
    
    // Process uploaded files
    if (uploadedFiles.length > 0) {
      // Extract text from each file
      const fileTexts = await Promise.all(
        uploadedFiles.map(async file => {
          const extractedText = await extractTextFromFile(file);
          return extractedText;
        })
      );
      
      // Search for each file's content separately
      for (const fileText of fileTexts) {
        if (fileText.trim()) {
          const fileResults = await fetchApiSearchResults(fileText);
          sources = [...sources, ...fileResults];
        }
      }
    }
  } else {
    // For database method, use the improved database comparison
    sources = checkAgainstDatabase(text, databaseSourceType);
    
    // Process uploaded files
    if (uploadedFiles.length > 0) {
      // Extract and search file content
      const fileTexts = await Promise.all(
        uploadedFiles.map(async file => {
          const extractedText = await extractTextFromFile(file);
          return extractedText;
        })
      );
      
      // Check each file's content against the database
      for (const fileText of fileTexts) {
        if (fileText.trim()) {
          const fileResults = checkAgainstDatabase(fileText, databaseSourceType);
          sources = [...sources, ...fileResults];
        }
      }
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
