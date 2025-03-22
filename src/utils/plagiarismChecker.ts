import { Source } from "@/components/SourceLink";
import { PlagiarismMethodType } from "@/components/PlagiarismMethod";
import type { DatabaseSourceType } from "@/components/PlagiarismMethod";

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

// Simulated web results for demonstration purposes
const simulatedWebResults = (query: string): Source[] => {
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

// Extract text from files (simulated)
const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      
      if (fileName.endsWith('.pdf')) {
        resolve(`Simulated content extracted from PDF file: ${file.name}. This would contain the actual text from the PDF document.`);
      } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        resolve(`Simulated content extracted from Word document: ${file.name}. This would contain the actual text from the Word document.`);
      } else {
        resolve(`Content from ${file.name}`);
      }
    }, 500);
  });
};

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

// Check text against the selected database
const checkAgainstDatabase = (text: string, databaseSourceType: DatabaseSourceType = 'research'): Source[] => {
  const database = getDatabaseBySourceType(databaseSourceType);
  const results: Source[] = [];
  
  database.forEach(document => {
    const documentContent = document.content;
    const similarity = calculateJaccardSimilarity(text, documentContent);
    
    if (similarity > 30) {
      results.push({
        url: `https://example.com/document/${document.id}`,
        title: document.title,
        matchPercentage: similarity,
        snippet: documentContent.substring(0, 150) + '...'
      });
    }
  });
  
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

// Check against uploaded student documents
const checkAgainstUploadedDocuments = async (text: string, files: File[]): Promise<Source[]> => {
  const results: Source[] = [];
  
  for (const file of files) {
    const fileContent = await extractTextFromFile(file);
    const similarity = calculateJaccardSimilarity(text, fileContent);
    
    if (similarity > 25) {
      results.push({
        url: `#document-${file.name}`,
        title: file.name,
        matchPercentage: similarity,
        snippet: fileContent.substring(0, 150) + '...'
      });
    }
  }
  
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

// Main function to check plagiarism
export const checkPlagiarism = async (
  text: string,
  method: PlagiarismMethodType,
  options: {
    databaseSourceType?: DatabaseSourceType;
    uploadedFiles?: File[];
    studentFiles?: File[];
  } = {}
): Promise<{ sources: Source[]; plagiarismPercentage: number }> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let sources: Source[] = [];
  const { databaseSourceType = 'research', uploadedFiles = [], studentFiles = [] } = options;
  
  if (method === "searchEngine") {
    sources = simulatedWebResults(text);
  } else {
    sources = checkAgainstDatabase(text, databaseSourceType);
    
    if (uploadedFiles.length > 0) {
      const extractedText = await Promise.all(uploadedFiles.map(extractTextFromFile));
      const combinedText = extractedText.join(' ');
      
      if (combinedText.trim()) {
        const fileSearchResults = simulatedWebResults(combinedText);
        sources = [...sources, ...fileSearchResults];
      }
    }
    
    if (studentFiles.length > 0) {
      const studentDocResults = await checkAgainstUploadedDocuments(text, studentFiles);
      sources = [...sources, ...studentDocResults];
    }
  }
  
  const plagiarismPercentage = sources.length > 0
    ? Math.min(Math.round(sources.reduce((sum, source) => sum + source.matchPercentage, 0) / sources.length), 100)
    : 0;
  
  return {
    sources,
    plagiarismPercentage
  };
};
