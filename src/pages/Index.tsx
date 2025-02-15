
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

    // Simulate API call with example data
    setTimeout(() => {
      const mockAnalysis = [
        {
          title: "Market Overview",
          description: "Strava operates in the highly competitive fitness tracking market with a focus on social features and community engagement.",
          marketData: {
            targetUsers: ["Athletes", "Runners", "Cyclists", "Fitness Enthusiasts", "Urban Athletes"],
            marketSize: "Global fitness app market size: $14.7 billion (2023)",
            entryBarriers: ["High Development Costs", "Strong Incumbents", "User Acquisition", "Data Privacy"],
            keyFeatures: ["GPS Tracking", "Social Feed", "Activity Analysis", "Challenges", "Premium Features"],
          },
        },
        {
          title: "Competition Analysis",
          description: "The market has several established players but opportunities exist for specialized features and niche audiences.",
          marketData: {
            targetUsers: ["Serious Athletes", "Casual Exercisers", "Team Sports", "Adventure Sports"],
            marketSize: "Expected CAGR of 17.6% (2024-2030)",
            entryBarriers: ["Brand Recognition", "Feature Parity", "Technical Infrastructure"],
            keyFeatures: ["Workout Planning", "Performance Analytics", "Community Features", "Mobile-First Design"],
          },
        },
        {
          title: "Opportunity Assessment",
          description: "While the market is mature, there are opportunities for innovation in specific niches and features.",
          marketData: {
            targetUsers: ["Niche Sports", "Corporate Wellness", "Health Enthusiasts", "Professional Teams"],
            marketSize: "Rising demand for digital fitness solutions",
            entryBarriers: ["Market Saturation", "User Retention", "Marketing Costs"],
            keyFeatures: ["AI Coaching", "Integration APIs", "Social Gamification", "Data Analytics"],
          },
        },
      ];

      setAnalysis(mockAnalysis);
      setIsLoading(false);
    }, 1500);
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
