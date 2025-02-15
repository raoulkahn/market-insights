import { useState } from "react";
import { motion } from "framer-motion";
import MarketAnalysisCard from "@/components/MarketAnalysisCard";
import MarketAnalysisRadar from "@/components/MarketAnalysisRadar";
import LoadingDots from "@/components/LoadingDots";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import { Download, Search, RefreshCw } from "lucide-react";

const Index = () => {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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

  const spotifyExample = [
    {
      title: "Music Streaming Platform Market Analysis",
      description: "Spotify operates in the highly competitive music streaming industry, where it has established itself as the global market leader. The company's success is driven by its strong recommendation algorithms, user-friendly interface, and extensive music library.",
      marketData: {
        targetUsers: ["Music Enthusiasts", "Casual Listeners", "Artists", "Podcast Creators", "Students"],
        marketSize: "Global music streaming market valued at $29.45 billion in 2023, expected to grow at 14.7% CAGR",
        entryBarriers: ["Music Licensing Costs", "Content Relationships", "Technical Infrastructure", "Network Effects"],
        keyFeatures: ["Personalized Playlists", "Offline Mode", "Social Sharing", "Multi-platform Support", "Podcast Integration"]
      }
    },
    {
      title: "Competitive Landscape Analysis",
      description: "While Spotify leads the global market, it faces strong competition from tech giants like Apple Music, Amazon Music, and YouTube Music. Each competitor leverages their existing ecosystems and hardware integration advantages.",
      marketData: {
        targetUsers: ["Premium Subscribers", "Free Tier Users", "Record Labels", "Independent Artists"],
        marketSize: "Spotify commands approximately 30% of the global streaming market share",
        entryBarriers: ["Brand Recognition", "User Data & Algorithms", "Industry Partnerships"],
        keyFeatures: ["HiFi Audio Quality", "Collaborative Playlists", "Artist Analytics", "Cross-platform Sync"]
      }
    },
    {
      title: "Growth Opportunities Assessment",
      description: "Spotify continues to expand beyond music into podcasts, audiobooks, and live audio experiences. The company is also focusing on emerging markets and creator tools to maintain its competitive edge.",
      marketData: {
        targetUsers: ["Content Creators", "Advertisers", "Premium Family Users", "Car Users"],
        marketSize: "Potential to reach 1 billion users by 2030 across all audio formats",
        entryBarriers: ["Content Production Costs", "Creator Relationships", "Ad Technology"],
        keyFeatures: ["Creator Tools", "Ad Targeting", "Live Audio Rooms", "Car Mode"]
      }
    }
  ];

  const trackAnalysis = async (startTime: number) => {
    try {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      await supabase.from('analytics').insert([{
        company_name: companyName,
        response_time_ms: responseTime,
        status: 'completed'
      }]);
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  const updateDownloadStatus = async () => {
    try {
      const { data } = await supabase
        .from('analytics')
        .select('id')
        .eq('company_name', companyName)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data[0]) {
        await supabase
          .from('analytics')
          .update({ pdf_downloaded: true })
          .eq('id', data[0].id);
      }
    } catch (error) {
      console.error('Error updating download status:', error);
    }
  };

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
    const startTime = Date.now();

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
      await trackAnalysis(startTime);
      
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

  const downloadPDF = async () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (2 * margin); // Available width for content
    const footerHeight = 20; // Space reserved for footer
    const maxYPosition = pageHeight - footerHeight - margin; // Max content position accounting for footer

    // Title
    pdf.setFontSize(20);
    pdf.text("Market Analysis Report", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Company name
    pdf.setFontSize(16);
    const companyTitle = `Analysis for: ${companyName}`;
    pdf.text(companyTitle, margin, yPosition);
    yPosition += 15;

    analysis.forEach((item, index) => {
      // Calculate required height for the current section
      const calculateSectionHeight = () => {
        let height = 0;
        const lineHeight = 7;
        
        // Title height
        height += 10;
        
        // Description height
        const descriptionLines = pdf.splitTextToSize(item.description, maxWidth);
        height += lineHeight * descriptionLines.length;
        
        if (item.marketData) {
          // Market data heights (labels + content)
          const targetUsersLines = pdf.splitTextToSize(item.marketData.targetUsers.join(", "), maxWidth);
          height += lineHeight + (lineHeight * targetUsersLines.length);
          
          const marketSizeLines = pdf.splitTextToSize(item.marketData.marketSize, maxWidth);
          height += lineHeight + (lineHeight * marketSizeLines.length);
          
          const barriersLines = pdf.splitTextToSize(item.marketData.entryBarriers.join(", "), maxWidth);
          height += lineHeight + (lineHeight * barriersLines.length);
          
          const featuresLines = pdf.splitTextToSize(item.marketData.keyFeatures.join(", "), maxWidth);
          height += lineHeight + (lineHeight * featuresLines.length);
          
          height += 10; // Additional spacing
        }
        
        return height;
      };

      // Check if we need a new page based on the calculated section height
      const sectionHeight = calculateSectionHeight();
      if (yPosition + sectionHeight > maxYPosition) {
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
      const descriptionLines = pdf.splitTextToSize(item.description, maxWidth);
      pdf.text(descriptionLines, margin, yPosition);
      yPosition += (7 * descriptionLines.length);

      // Market Data
      if (item.marketData) {
        // Target Users
        pdf.setFont(undefined, "bold");
        pdf.text("Target Users:", margin, yPosition);
        yPosition += 7;
        pdf.setFont(undefined, "normal");
        const targetUsersText = item.marketData.targetUsers.join(", ");
        const targetUsersLines = pdf.splitTextToSize(targetUsersText, maxWidth);
        pdf.text(targetUsersLines, margin, yPosition);
        yPosition += (7 * targetUsersLines.length);

        // Market Size
        pdf.setFont(undefined, "bold");
        pdf.text("Market Size:", margin, yPosition);
        yPosition += 7;
        pdf.setFont(undefined, "normal");
        const marketSizeLines = pdf.splitTextToSize(item.marketData.marketSize, maxWidth);
        pdf.text(marketSizeLines, margin, yPosition);
        yPosition += (7 * marketSizeLines.length);

        // Entry Barriers
        pdf.setFont(undefined, "bold");
        pdf.text("Entry Barriers:", margin, yPosition);
        yPosition += 7;
        pdf.setFont(undefined, "normal");
        const barriersText = item.marketData.entryBarriers.join(", ");
        const barriersLines = pdf.splitTextToSize(barriersText, maxWidth);
        pdf.text(barriersLines, margin, yPosition);
        yPosition += (7 * barriersLines.length);

        // Key Features
        pdf.setFont(undefined, "bold");
        pdf.text("Required Features:", margin, yPosition);
        yPosition += 7;
        pdf.setFont(undefined, "normal");
        const featuresText = item.marketData.keyFeatures.join(", ");
        const featuresLines = pdf.splitTextToSize(featuresText, maxWidth);
        pdf.text(featuresLines, margin, yPosition);
        yPosition += (7 * featuresLines.length + 10);
      }
    });

    // Add generation date and footer on each page
    const pageCount = pdf.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, pageHeight - margin);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - margin, { align: "center" });
      pdf.text("Created by Raoul Kahn", pageWidth - margin, pageHeight - margin, { align: "right" });
    }

    // Save the PDF
    pdf.save(`market-analysis-${companyName.toLowerCase().replace(/\s+/g, "-")}.pdf`);

    await updateDownloadStatus();

    toast({
      title: "PDF Downloaded",
      description: "Your market analysis report has been downloaded successfully.",
    });
  };

  const handleReset = () => {
    setCompanyName("");
    setAnalysis([]);
    toast({
      title: "Analysis Reset",
      description: "You can now analyze a different company.",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-soft-gray to-white flex flex-col"
    >
      <div className="container max-w-6xl px-4 py-16 mx-auto flex-grow">
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
              className="text-sm font-semibold text-blue-600"
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
            className="relative flex items-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter a company name (e.g., OpenAI) ..."
                className="w-full pl-12 pr-6 py-4 text-lg bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ml-4 px-6 py-4 bg-blue-600 text-white rounded-xl transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 hover:shadow-lg"
            >
              Analyze
            </motion.button>
          </motion.div>
        </form>

        {!analysis.length && !isLoading && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-16 space-y-4"
            >
              <div className="text-center mb-8">
                <span className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium shadow-sm">
                  Example Analysis: Spotify
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {spotifyExample.map((item, index) => (
                  <MarketAnalysisCard
                    key={index}
                    index={index}
                    title={item.title}
                    description={item.description}
                    marketData={item.marketData}
                  />
                ))}
                {spotifyExample.length > 0 && (
                  <MarketAnalysisRadar
                    marketData={spotifyExample[0].marketData}
                    index={spotifyExample.length}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}

        <div className="space-y-6">
          {isLoading && <LoadingDots />}
          
          {analysis.length > 0 && (
            <motion.div 
              className="flex justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={downloadPDF}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors hover:shadow-lg"
              >
                <Download size={20} />
                Download PDF Report
              </motion.button>
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors hover:shadow-lg"
              >
                <RefreshCw size={20} />
                New Analysis
              </motion.button>
            </motion.div>
          )}
          
          {analysis.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.map((item, index) => (
                <MarketAnalysisCard
                  key={index}
                  index={index}
                  title={item.title}
                  description={item.description}
                  marketData={item.marketData}
                />
              ))}
              {analysis.length > 0 && (
                <MarketAnalysisRadar
                  marketData={analysis[0].marketData}
                  index={analysis.length}
                />
              )}
            </div>
          )}
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
