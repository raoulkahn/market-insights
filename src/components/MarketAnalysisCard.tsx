
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface MarketData {
  targetUsers: string[];
  marketSize: string;
  entryBarriers: string[];
  keyFeatures: string[];
}

interface CompetitiveAnalysisCardProps {
  index: number;
  title: string;
  description: string;
  marketData: MarketData;
}

const MarketAnalysisCard = ({ index, title, description, marketData }: CompetitiveAnalysisCardProps) => {
  // Check if this is a competition analysis card
  const isCompetitionAnalysis = title.toLowerCase().includes("competition") || 
                               title.toLowerCase().includes("competitive");
  
  // Format description to include specific competitors if this is a competition analysis
  const enhancedDescription = isCompetitionAnalysis 
    ? enhanceCompetitionDescription(description)
    : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full bg-gray-100 border-none shadow-md">
        <CardHeader className="pb-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{enhancedDescription}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Target Users</h4>
              <p className="text-sm text-gray-600">{marketData.targetUsers.join(", ")}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Market Size</h4>
              <p className="text-sm text-gray-600">{marketData.marketSize}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Entry Barriers</h4>
              <p className="text-sm text-gray-600">{marketData.entryBarriers.join(", ")}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Key Features</h4>
              <p className="text-sm text-gray-600">{marketData.keyFeatures.join(", ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper function to enhance competition description with specific competitor names
const enhanceCompetitionDescription = (description: string): string => {
  // Check for generic "various social media platforms" text
  if (description.includes("various social media platforms")) {
    // Social media competitors
    if (description.toLowerCase().includes("instagram")) {
      return description.replace(
        "various social media platforms",
        "major competitors like TikTok, Snapchat, YouTube, and Facebook"
      );
    }
    
    // For TikTok
    if (description.toLowerCase().includes("tiktok")) {
      return description.replace(
        "various social media platforms",
        "major competitors like Instagram, Snapchat, YouTube, and Facebook"
      );
    }
  }
  
  // For automotive companies
  if (description.includes("various automakers") || description.includes("automotive industry")) {
    if (description.toLowerCase().includes("tesla")) {
      return description.replace(
        /(various automakers|competition in the automotive industry)/,
        "major competitors like Volkswagen Group, BYD, Ford, and Rivian"
      );
    }
    
    if (description.toLowerCase().includes("ford")) {
      return description.replace(
        /(various automakers|competition in the automotive industry)/,
        "major competitors like General Motors, Toyota, and Volkswagen"
      );
    }
  }
  
  // Generic enhancement for competition sections that don't have specific replacements
  if (description.includes("competition") && description.includes("various")) {
    return description.replace(
      /various (companies|platforms|competitors)/i,
      "key industry competitors"
    );
  }
  
  return description;
};

export default MarketAnalysisCard;
