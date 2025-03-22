
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TextInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 5000;

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleClear = () => {
    setText("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type text to check for plagiarism..."
            className="min-h-[200px] resize-y glass-morphism bg-secondary/20 border-secondary/30 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-all duration-300"
            maxLength={maxChars}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {charCount}/{maxChars}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePaste}
              className="glass-morphism bg-secondary/20 hover:bg-secondary/40"
            >
              Paste
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClear}
              className="glass-morphism bg-secondary/20 hover:bg-secondary/40"
            >
              Clear
            </Button>
          </div>

          <Button 
            type="submit" 
            disabled={!text.trim() || isLoading}
            className="gradient-border bg-primary/80 hover:bg-primary text-primary-foreground"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                  Checking...
                </motion.div>
              ) : (
                <motion.div
                  key="check"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Check Plagiarism
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TextInput;
