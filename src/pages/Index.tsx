import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MarketAnalysisCard from "@/components/MarketAnalysisCard";
import MarketAnalysisRadar from "@/components/MarketAnalysisRadar";
import LoadingDots from "@/components/LoadingDots";
import NewsSection from "@/components/NewsSection";
import CompetitorComparison from "@/components/CompetitorComparison";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import { Download, Search, RefreshCw } from "lucide-react";
import { getCompanyProductImage } from "@/utils/companyImages";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
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
  const [newsArticles, setNewsArticles] = useState<Array<{
    title: string;
    description: string;
    url: string;
    source: string;
    publishedDate: string;
  }>>([]);

  // Updated to initialize with empty array rather than null
  const [competitors, setCompetitors] = useState<Array<{
    name: string;
    marketShare: string;
    strengths: string[];
    weaknesses: string[];
    primaryMarkets: string[];
    yearFounded?: string;
  }>>([]);

  const teslaExample = [
    {
      title: "Electric Vehicle Market Analysis",
      description: "Tesla operates in the rapidly growing electric vehicle industry, where it has established itself as the global market leader. The company's success is driven by its innovative technology, strong brand, and first-mover advantage in the premium EV segment.",
      marketData: {
        targetUsers: ["Environmentally Conscious Consumers", "Tech Enthusiasts", "Luxury Car Buyers", "Early Adopters", "Corporate Fleets"],
        marketSize: "Global electric vehicle market valued at $162.34 billion in 2020, expected to reach $802.81 billion by 2027 with a CAGR of 22.6%",
        entryBarriers: ["Battery Technology", "Manufacturing Scale", "Charging Infrastructure", "Brand Recognition"],
        keyFeatures: ["Long Battery Range", "Autonomous Driving", "Over-the-air Updates", "Supercharger Network", "Integrated Ecosystem"]
      }
    },
    {
      title: "Competitive Landscape Analysis",
      description: "While Tesla leads the global EV market, it faces increasing competition from both traditional automakers like Volkswagen, GM, and Ford, as well as new entrants like Rivian, Lucid Motors, and NIO, all investing heavily in electric vehicle technology.",
      marketData: {
        targetUsers: ["Individual Consumers", "Ride-sharing Companies", "Government Agencies", "Commercial Fleet Operators"],
        marketSize: "Tesla commands approximately 14% of the global EV market share, with significant growth potential in emerging markets",
        entryBarriers: ["Research & Development Costs", "Regulatory Compliance", "Supply Chain Complexity"],
        keyFeatures: ["Premium Design", "Performance Specifications", "Software Integration", "Energy Efficiency"]
      }
    },
    {
      title: "Growth Opportunities Assessment",
      description: "Tesla continues to expand beyond passenger vehicles into energy generation and storage, autonomous driving technology, and robotics. The company is also focusing on vertical integration and manufacturing innovation to maintain its competitive edge.",
      marketData: {
        targetUsers: ["Solar Power Customers", "Energy Storage Customers", "AI & Robotics Enthusiasts"],
        marketSize: "Potential to expand into trillion-dollar energy and robotics markets by 2030",
        entryBarriers: ["Technical Expertise", "Capital Requirements", "Established Competitors"],
        keyFeatures: ["Solar Roof", "Powerwall", "Full Self-Driving", "Tesla Bot", "Gigafactory Scaling"]
      }
    }
  ];

  // Fetch Tesla news on initial load
  useEffect(() => {
    fetchNewsArticles("Tesla");
  }, []);

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

  const fetchNewsArticles = async (company: string) => {
    setIsLoadingNews(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { companyName: company.trim() }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to fetch news');
      }

      setNewsArticles(data?.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsArticles([]);
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCompanyName(companyName)) {
      return;
    }

    setIsLoading(true);
    setAnalysis([]);
    setNewsArticles([]);
    setCompetitors([]); // Reset to empty array, not null
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke('analyze-market', {
        body: { companyName: companyName.trim() }
      });
      
      if (error) {
        console.error('Error response:', error);
        throw new Error(error.message || 'Failed to analyze market');
      }

      if (!data?.analysis || !Array.isArray(data.analysis)) {
        throw new Error('Invalid response format from analysis');
      }

      console.log("Complete API response:", data);
      
      setAnalysis(data.analysis);
      
      // Set competitors if they exist in the response, otherwise use empty array
      if (data.competitors && Array.isArray(data.competitors)) {
        console.log("Competitors data:", data.competitors);
        setCompetitors(data.competitors);
      } else {
        console.log("No competitors data found in response");
        setCompetitors([]);
      }
      
      await trackAnalysis(startTime);
      
      fetchNewsArticles(companyName);
      
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
    setNewsArticles([]);
    toast({
      title: "Analysis Reset",
      description: "You can now analyze a different company.",
    });
  };

  const validateCompanyName = (name: string): boolean => {
    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a company name.",
        variant: "destructive",
      });
      return false;
    }

    if (trimmedName.length < 2 && !/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(trimmedName)) {
      toast({
        title: "Invalid Company Name",
        description: "Company name should be at least 2 characters long or contain both a letter and a number.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Example Tesla competitors data for the demo
  const teslaCompetitors = [
    {
      name: "Volkswagen Group",
      marketShare: "11% of global EV market",
      strengths: ["Manufacturing scale", "Global distribution", "Brand portfolio"],
      weaknesses: ["Legacy infrastructure", "Software capabilities"],
      primaryMarkets: ["Europe", "China", "North America"],
      yearFounded: "1937"
    },
    {
      name: "BYD",
      marketShare: "18% of global EV market",
      strengths: ["Battery technology", "Cost leadership", "Vertical integration"],
      weaknesses: ["Limited global presence", "Brand recognition outside Asia"],
      primaryMarkets: ["China", "Asia-Pacific", "Emerging markets"],
      yearFounded: "1995"
    },
    {
      name: "Rivian",
      marketShare: "1% of global EV market",
      strengths: ["Specialized in EV trucks/SUVs", "Strong backing from investors", "Adventure-focused brand"],
      weaknesses: ["Production ramp challenges", "Financial sustainability"],
      primaryMarkets: ["North America"],
      yearFounded: "2009"
    }
  ];

  // Updated Tesla image URL - check that it works correctly
  const teslaImageUrl = "https://images.unsplash.com/photo-1562053342-7280b39e696c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";

  // Better check if an image exists for a company
  const checkImageExists = (companyName: string): boolean => {
    const imageUrl = getCompanyProductImage(companyName);
    // If the imageUrl is the fallback image, return false
    return imageUrl !== "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80";
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
          <div className="flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-base font-semibold text-gray-800"
            >
              <img
                src="https://cdn.worldvectorlogo.com/logos/openai-2.svg"
                alt="OpenAI Logo"
                className="w-5 h-5"
              />
              <span className="text-blue-600">Powered by OpenAI</span>
            </motion.div>
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Competitive Market Analysis Tool
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
                placeholder={!companyName ? "Enter company (e.g., Tesla)" : ""}
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
                  Example Analysis: Tesla
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teslaExample.map((item, index) => (
                  <MarketAnalysisCard
                    key={index}
                    index={index}
                    title={item.title}
                    description={item.description}
                    marketData={item.marketData}
                  />
                ))}
                {teslaExample.length > 0 && (
                  <MarketAnalysisRadar
                    marketData={teslaExample[0].marketData}
                    index={teslaExample.length}
                  />
                )}
              </div>
              
              {/* Add Tesla Competitor Comparison to example section */}
              <CompetitorComparison 
                companyName="Tesla" 
                competitors={teslaCompetitors}
                isExample={true}
              />
              
              {/* Tesla news as example */}
              {newsArticles.length > 0 && !isLoadingNews && (
                <NewsSection 
                  companyName="Tesla"
                  articles={newsArticles}
                  isLoading={isLoadingNews}
                />
              )}
              
              {isLoadingNews && <LoadingDots />}
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

          {/* Always show competitor comparison if we have analysis, even with empty competitors array */}
          {analysis.length > 0 && (
            <CompetitorComparison 
              companyName={companyName} 
              competitors={competitors}
            />
          )}

          {analysis.length > 0 && (
            <NewsSection 
              companyName={companyName}
              articles={newsArticles}
              isLoading={isLoadingNews}
            />
          )}
        </div>
      </div>
      
      {analysis.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="py-4 text-sm text-yellow-800 bg-yellow-50 border-t border-yellow-100 text-center"
        >
          <p className="max-w-2xl mx-auto px-4">
            Note: Analysis is based on AI-generated data which may not reflect the most current market conditions. 
            Please verify critical information from additional sources before making business decisions.
          </p>
        </motion.div>
      )}
      
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
