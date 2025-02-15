
import { useState } from "react";
import { motion } from "framer-motion";
import CompetitiveAnalysisCard from "@/components/CareerSuggestionCard";
import LoadingDots from "@/components/LoadingDots";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import { Download, Search, Lightbulb } from "lucide-react";

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

  const downloadPDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Title
    pdf.setFontSize(20);
    pdf.text("Market Analysis Report", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Company name
    pdf.setFontSize(16);
    pdf.text(`Analysis for: ${companyName}`, margin, yPosition);
    yPosition += 15;

    analysis.forEach((item, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Section title
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text(`${index + 1}. ${item.title}`, margin, yPosition);
      yPosition += 10;

      // Description
      pdf.setFontSize(12);
      pdf.setFont(undefined, "normal");
      const descriptionLines = pdf.splitTextToSize(item.description, contentWidth);
      pdf.text(descriptionLines, margin, yPosition);
      yPosition += 10 * descriptionLines.length;

      // Market Data
      if (item.marketData) {
        // Target Users
        pdf.setFont(undefined, "bold");
        pdf.text("Target Users:", margin, yPosition);
        yPosition += 7;
        pdf.setFont(undefined, "normal");
        pdf.text(item.marketData.targetUsers.join(", "), margin, yPosition);
        yPosition += 10;

        // Market Size
        pdf.setFont(undefined, "bold");
        pdf.text("Market Size:", margin, yPosition);
        yPosition += 7;
        pdf.setFont(undefined, "normal");
        pdf.text(item.marketData.marketSize, margin, yPosition);
        yPosition += 10;

        // Entry Barriers
        pdf.setFont(undefined, "bold");
        pdf.text("Entry Barriers:", margin, yPosition);
        yPosition += 7;
        pdf.setFont(undefined, "normal");
        pdf.text(item.marketData.entryBarriers.join(", "), margin, yPosition);
        yPosition += 10;

        // Key Features
        pdf.setFont(undefined, "bold");
        pdf.text("Required Features:", margin, yPosition);
        yPosition += 7;
        pdf.setFont(undefined, "normal");
        pdf.text(item.marketData.keyFeatures.join(", "), margin, yPosition);
        yPosition += 20;
      }
    });

    // Add generation date and footer
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 287);
    pdf.text("Created by Raoul Kahn", pageWidth - margin, 287, { align: "right" });

    // Save the PDF
    pdf.save(`market-analysis-${companyName.toLowerCase().replace(/\s+/g, "-")}.pdf`);

    toast({
      title: "PDF Downloaded",
      description: "Your market analysis report has been downloaded successfully.",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-soft-gray to-white flex flex-col"
    >
      <div className="container max-w-4xl px-4 py-16 mx-auto flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="flex items-center justify-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-1.5 text-sm font-medium text-gray-800 bg-gray-100 rounded-full"
            >
              Market Analysis Tool
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-sm font-semibold text-purple-600"
            >
              Powered by OpenAI
            </motion.div>
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
          <motion.div 
            className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter a company name (e.g., Strava)..."
                className="w-full pl-12 pr-6 py-4 text-lg bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2 px-6 py-2 bg-gray-900 text-white rounded-lg transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 hover:shadow-lg"
            >
              Analyze
            </motion.button>
          </motion.div>
        </form>

        {!analysis.length && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-500 mb-8"
          >
            <Lightbulb className="mx-auto mb-4 text-purple-400" size={32} />
            <p>Enter a company name above to get started with the market analysis</p>
          </motion.div>
        )}

        <div className="space-y-6">
          {isLoading && <LoadingDots />}
          
          {analysis.length > 0 && (
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={downloadPDF}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors hover:shadow-lg"
              >
                <Download size={20} />
                Download PDF Report
              </motion.button>
            </motion.div>
          )}
          
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
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="py-4 text-center text-sm text-gray-500 bg-gray-50"
      >
        Created by Raoul Kahn
      </motion.footer>
    </motion.div>
  );
};

export default Index;
