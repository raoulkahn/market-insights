
import { useState } from "react";
import { motion } from "framer-motion";
import CareerSuggestionCard from "@/components/CareerSuggestionCard";
import LoadingDots from "@/components/LoadingDots";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [profession, setProfession] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ title: string; description: string; skills: string[] }>>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profession.trim()) {
      toast({
        title: "Please enter your profession",
        description: "We need to know your current role to provide suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuggestions([]);

    // Simulate API call with example data
    setTimeout(() => {
      const mockSuggestions = [
        {
          title: "UX/UI Designer",
          description: "Apply your understanding of user needs and problem-solving skills to create intuitive digital experiences.",
          skills: ["Problem Solving", "User Empathy", "Critical Thinking", "Communication"],
        },
        {
          title: "Product Manager",
          description: "Leverage your domain expertise to guide product development and strategy.",
          skills: ["Leadership", "Strategic Thinking", "Analysis", "Stakeholder Management"],
        },
        {
          title: "Business Analyst",
          description: "Use your analytical skills and industry knowledge to drive business improvements.",
          skills: ["Data Analysis", "Process Optimization", "Research", "Documentation"],
        },
      ];

      setSuggestions(mockSuggestions);
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
            Career Explorer
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Discover Your Next Career Move
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your current profession and we'll suggest three alternative careers that
            leverage your existing skills and experience.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:relative">
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Enter your current profession..."
              className="w-full px-6 py-4 text-lg bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2 px-6 py-2 bg-gray-900 text-white rounded-lg transition-all duration-200 hover:bg-gray-800 disabled:opacity-50"
            >
              Explore
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {isLoading && <LoadingDots />}
          
          {suggestions.map((suggestion, index) => (
            <CareerSuggestionCard
              key={index}
              index={index}
              title={suggestion.title}
              description={suggestion.description}
              skills={suggestion.skills}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
