
import { useState } from "react";
import { motion } from "framer-motion";
import CompetitiveAnalysisCard from "@/components/CareerSuggestionCard";
import LoadingDots from "@/components/LoadingDots";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Array<{
    title: string;
    description: string;
    marketData: {
      targetUsers: string[];
      marketSize: string;
      entryBarriers: string[];
      keyFeatures: string[];
    };
  }>>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast({
        title: "Please enter a company name",
        description: "We need a company name to analyze the market.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis([]);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-market', {
        body: { companyName }
      });
      
      if (error) {
        console.error('Error response:', error);
        throw new Error(error.message || 'Failed to analyze market');
      }

      if (!data?.analysis || !Array.isArray(data.analysis)) {
        throw new Error('Invalid response format from analysis');
      }

      setAnalysis(data.analysis);
      
      toast({
        title: "Analysis Complete",
        description: "Market analysis has been generated successfully.",
      });
    } catch (error) {
      console.error('Detailed error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate market analysis. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-soft-gray to-white flex flex-col">
      <div className="container max-w-4xl px-4 py-16 mx-auto flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
              Market Analysis Tool
            </div>
            <span className="text-sm font-medium" style={{ color: '#8B5CF6' }}>
              Powered by OpenAI
            </span>
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Competitive Market Analysis
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter a company name to analyze the market landscape, competition, and potential opportunities
            in their space. Get insights on market size, target users, and required features.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:relative">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter a company name (e.g., Strava)..."
              className="w-full px-6 py-4 text-lg bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2 px-6 py-2 bg-gray-900 text-white rounded-lg transition-all duration-200 hover:bg-gray-800 disabled:opacity-50"
            >
              Analyze
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {isLoading && <LoadingDots />}
          
          {Array.isArray(analysis) && analysis.map((item, index) => (
            <CompetitiveAnalysisCard
              key={index}
              index={index}
              title={item.title}
              description={item.description}
              marketData={item.marketData}
            />
          ))}
        </div>
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-500 bg-gray-50">
        Created by Raoul Kahn
      </footer>
    </div>
  );
};

export default Index;
