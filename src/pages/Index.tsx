
import React, { useState } from "react";
import { motion } from "framer-motion";
import TextInput from "@/components/TextInput";
import PlagiarismMethod, { PlagiarismMethodType } from "@/components/PlagiarismMethod";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Source } from "@/components/SourceLink";
import { checkPlagiarism } from "@/utils/plagiarismChecker";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedMethod, setSelectedMethod] = useState<PlagiarismMethodType>("searchEngine");
  const [isChecking, setIsChecking] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [plagiarismPercentage, setPlagiarismPercentage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleMethodSelect = (method: PlagiarismMethodType) => {
    setSelectedMethod(method);
    
    // Reset results when changing method
    if (showResults) {
      setShowResults(false);
      setSources([]);
      setPlagiarismPercentage(0);
    }
  };

  const handleTextSubmit = async (text: string) => {
    if (text.length < 20) {
      toast({
        title: "Text too short",
        description: "Please enter at least 20 characters for accurate plagiarism detection.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setShowResults(false);

    try {
      const result = await checkPlagiarism(text, selectedMethod);
      setSources(result.sources);
      setPlagiarismPercentage(result.plagiarismPercentage);
      setShowResults(true);
      
      if (result.sources.length === 0) {
        toast({
          title: "No plagiarism detected",
          description: "Your text appears to be original content.",
        });
      } else {
        toast({
          title: `${result.plagiarismPercentage}% plagiarized content detected`,
          description: `Found ${result.sources.length} matching ${result.sources.length === 1 ? "source" : "sources"}.`,
          variant: result.plagiarismPercentage > 30 ? "destructive" : "default",
        });
      }
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      toast({
        title: "Error",
        description: "Failed to check plagiarism. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-16 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <img src="/logo.svg" alt="Plagiarism Checker Logo" className="h-14 w-14" />
          </div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-3 text-gradient"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Plagiarism Checker
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Verify the originality of your content with our advanced plagiarism detection tools
          </motion.p>
        </div>

        <PlagiarismMethod
          selectedMethod={selectedMethod}
          onSelectMethod={handleMethodSelect}
        />

        <TextInput
          onSubmit={handleTextSubmit}
          isLoading={isChecking}
        />

        <ResultsDisplay
          isVisible={showResults}
          sources={sources}
          plagiarismPercentage={plagiarismPercentage}
          methodType={selectedMethod}
        />
      </motion.div>
    </div>
  );
};

export default Index;
