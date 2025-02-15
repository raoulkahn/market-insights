import { useState } from "react";
import { motion } from "framer-motion";
import CompetitiveAnalysisCard from "@/components/CareerSuggestionCard";
import LoadingDots from "@/components/LoadingDots";
import { useToast } from "@/hooks/use-toast";

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
      const response = await fetch('https://lovable-ai-edmsrslmcv.lovableai.workers.dev/analyze-market', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze market');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      
      toast({
        title: "Analysis Complete",
        description: "Market analysis has been generated successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate market analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-soft-gray to-white">
      <div className="container max-w-4xl px-4 py-16 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-block px-4 py-1.5 mb-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
            Market Analysis Tool
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
          
          {analysis.map((item, index) => (
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
    </div>
  );
};

export default Index;
