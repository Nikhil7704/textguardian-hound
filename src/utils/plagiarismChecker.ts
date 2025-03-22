
import { Source } from "@/components/SourceLink";
import { PlagiarismMethodType } from "@/components/PlagiarismMethod";

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

// Simulated web results for demonstration purposes
const simulatedWebResults = (query: string): Source[] => {
  // Simple logic to handle some common topics for demo purposes
  const normalizedQuery = query.toLowerCase();
  
  if (normalizedQuery.includes("machine learning") || normalizedQuery.includes("artificial intelligence")) {
    return [
      {
        url: "https://en.wikipedia.org/wiki/Machine_learning",
        title: "Machine learning - Wikipedia",
        matchPercentage: 78,
        snippet: "Machine learning is a branch of artificial intelligence and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy."
      },
      {
        url: "https://www.ibm.com/cloud/learn/machine-learning",
        title: "What is Machine Learning? | IBM",
        matchPercentage: 65,
        snippet: "Machine learning is a form of AI that enables a system to learn from data rather than through explicit programming."
      }
    ];
  }
  
  if (normalizedQuery.includes("climate change") || normalizedQuery.includes("global warming")) {
    return [
      {
        url: "https://www.un.org/en/climatechange",
        title: "Climate Change | United Nations",
        matchPercentage: 82,
        snippet: "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change."
      },
      {
        url: "https://climate.nasa.gov/",
        title: "Climate Change: Vital Signs of the Planet – NASA",
        matchPercentage: 71,
        snippet: "The current warming trend is of particular significance because it is unequivocally the result of human activity since the mid-20th century."
      }
    ];
  }
  
  if (normalizedQuery.includes("web development") || normalizedQuery.includes("frontend")) {
    return [
      {
        url: "https://developer.mozilla.org/en-US/docs/Learn",
        title: "Learn web development | MDN",
        matchPercentage: 68,
        snippet: "Modern web development encompasses a variety of technologies and methodologies including responsive design, progressive web apps, and component-based architecture."
      },
      {
        url: "https://www.w3schools.com/",
        title: "W3Schools Online Web Tutorials",
        matchPercentage: 55,
        snippet: "Web development refers to building, creating, and maintaining websites. It includes aspects such as web design, web publishing, web programming, and database management."
      }
    ];
  }
  
  // Generic results for other queries
  return [
    {
      url: "https://example.com/result1",
      title: "Generic Result 1",
      matchPercentage: Math.floor(Math.random() * 30) + 40,
      snippet: "This is a simulated result for demonstration purposes. In a real implementation, this would be an actual matching passage from the web."
    },
    {
      url: "https://example.com/result2",
      title: "Generic Result 2",
      matchPercentage: Math.floor(Math.random() * 20) + 30,
      snippet: "Another simulated result showing how the plagiarism detection would display found matches."
    }
  ];
};

// Calculate Jaccard similarity coefficient (simplified for demo)
const calculateJaccardSimilarity = (text1: string, text2: string): number => {
  const set1 = new Set(text1.toLowerCase().split(/\s+/));
  const set2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...set1].filter(word => set2.has(word)));
  const union = new Set([...set1, ...set2]);
  
  return Math.floor((intersection.size / union.size) * 100);
};

// Check text against academic database
const checkAgainstDatabase = (text: string): Source[] => {
  const results: Source[] = [];
  
  academicDatabase.forEach(document => {
    const similarity = calculateJaccardSimilarity(text, document.content);
    
    // Only include results with significant similarity
    if (similarity > 30) {
      results.push({
        url: document.url,
        title: document.title,
        matchPercentage: similarity,
        snippet: document.content
      });
    }
  });
  
  // Sort by highest match percentage
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

// Main function to check plagiarism
export const checkPlagiarism = async (
  text: string,
  method: PlagiarismMethodType
): Promise<{ sources: Source[]; plagiarismPercentage: number }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let sources: Source[] = [];
  
  if (method === "searchEngine") {
    sources = simulatedWebResults(text);
  } else {
    sources = checkAgainstDatabase(text);
  }
  
  // Calculate overall plagiarism percentage
  // In a real system, this would be more sophisticated
  const plagiarismPercentage = sources.length > 0
    ? Math.min(Math.round(sources.reduce((sum, source) => sum + source.matchPercentage, 0) / sources.length), 100)
    : 0;
  
  return {
    sources,
    plagiarismPercentage
  };
};
