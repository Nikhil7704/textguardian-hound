
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Search } from "lucide-react";

interface ApiKeyConfigProps {
  onApiKeysChange: (keys: {
    bingApiKey: string;
    googleApiKey: string;
    searchEngineId: string;
  }) => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onApiKeysChange }) => {
  const [bingApiKey, setBingApiKey] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [searchEngineId, setSearchEngineId] = useState("");
  const [activeTab, setActiveTab] = useState<string>("bing");

  useEffect(() => {
    // Load saved API keys from localStorage if available
    const savedKeys = localStorage.getItem("plagiarism_checker_api_keys");
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        setBingApiKey(parsedKeys.bingApiKey || "");
        setGoogleApiKey(parsedKeys.googleApiKey || "");
        setSearchEngineId(parsedKeys.searchEngineId || "");
      } catch (error) {
        console.error("Error parsing saved API keys:", error);
      }
    }
  }, []);

  const handleSaveKeys = () => {
    onApiKeysChange({
      bingApiKey,
      googleApiKey,
      searchEngineId,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto mb-8"
    >
      <div className="bg-card/30 glass-morphism rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Search API Configuration</h3>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="bing">Bing Search API</TabsTrigger>
            <TabsTrigger value="google">Google Search API</TabsTrigger>
          </TabsList>

          <TabsContent value="bing" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Bing API Key (Get a free key from Microsoft Azure)
              </label>
              <Input
                type="password"
                value={bingApiKey}
                onChange={(e) => setBingApiKey(e.target.value)}
                placeholder="Enter your Bing API Key"
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                Free for 1,000 queries/month. Get your key from{" "}
                <a
                  href="https://portal.azure.com/#create/microsoft.bingsearch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Microsoft Azure Portal
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="google" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Google API Key (Get from Google Cloud Console)
              </label>
              <Input
                type="password"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                placeholder="Enter your Google API Key"
                className="bg-background/50"
              />

              <label className="text-sm text-muted-foreground">
                Search Engine ID (Custom Search Engine ID)
              </label>
              <Input
                type="text"
                value={searchEngineId}
                onChange={(e) => setSearchEngineId(e.target.value)}
                placeholder="Enter your Search Engine ID"
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from{" "}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Cloud Console
                </a>{" "}
                and create a Custom Search Engine at{" "}
                <a
                  href="https://programmablesearchengine.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Programmable Search Engine
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleSaveKeys}
          className="w-full mt-4 gradient-border bg-primary/80 hover:bg-primary text-primary-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          Save API Key
        </Button>
      </div>
    </motion.div>
  );
};

export default ApiKeyConfig;
