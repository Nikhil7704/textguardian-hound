
import React from "react";
import { motion } from "framer-motion";
import { Search, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export type PlagiarismMethodType = "searchEngine" | "database";

interface PlagiarismMethodProps {
  selectedMethod: PlagiarismMethodType;
  onSelectMethod: (method: PlagiarismMethodType) => void;
}

const PlagiarismMethod: React.FC<PlagiarismMethodProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <div className="bg-card/30 glass-morphism rounded-xl p-1 grid grid-cols-2 gap-2">
        <MethodOption
          id="searchEngine"
          title="Search Engine"
          description="Compares text with web content to find exact matches"
          icon={<Search className="h-6 w-6" />}
          isSelected={selectedMethod === "searchEngine"}
          onClick={() => onSelectMethod("searchEngine")}
        />
        <MethodOption
          id="database"
          title="Database"
          description="Checks against our curated database of academic content"
          icon={<Database className="h-6 w-6" />}
          isSelected={selectedMethod === "database"}
          onClick={() => onSelectMethod("database")}
        />
      </div>
    </div>
  );
};

interface MethodOptionProps {
  id: PlagiarismMethodType;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const MethodOption: React.FC<MethodOptionProps> = ({
  id,
  title,
  description,
  icon,
  isSelected,
  onClick,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 text-center h-36",
        isSelected
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/30"
      )}
    >
      {isSelected && (
        <motion.div
          layoutId="selectedMethod"
          className="absolute inset-0 rounded-lg bg-secondary"
          initial={false}
          transition={{ type: "spring", duration: 0.6 }}
        />
      )}
      <span className="relative z-10 mb-2">{icon}</span>
      <span className="relative z-10 font-semibold mb-1">{title}</span>
      <p className="relative z-10 text-xs opacity-80">{description}</p>
    </motion.button>
  );
};

export default PlagiarismMethod;
