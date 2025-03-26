
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
                               title.toLowerCase().includes("competitive") ||
                               title.toLowerCase().includes("overview") ||
                               title.toLowerCase().includes("landscape");
  
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
  let enhancedDesc = description;
  const lowerDesc = description.toLowerCase();
  
  // Generic patterns that indicate vague competitor references
  const vaguePhrases = [
    /\b(various|multiple|several|many|different) (social media platforms|platforms|competitors|companies|players|brands)\b/i,
    /\b(faces|experiencing|has|with) (competition|competitive pressure)\b/i,
    /\b(other|leading|major) (platforms|competitors|players|brands)\b/i
  ];
  
  // TikTok specific enhancement
  if (lowerDesc.includes("tik tok") || lowerDesc.includes("tiktok")) {
    for (const pattern of vaguePhrases) {
      if (pattern.test(enhancedDesc)) {
        enhancedDesc = enhancedDesc.replace(
          pattern,
          "major competitors like Instagram, Snapchat, YouTube, and Facebook"
        );
        return enhancedDesc; // Return after first match to avoid multiple replacements
      }
    }
    
    // If we haven't found any patterns yet but it's definitely about TikTok, 
    // try to insert competitor names near the end of a sentence about competition
    if (lowerDesc.includes("competition") || lowerDesc.includes("competitive")) {
      const competitionSentencePattern = /([^.!?]*(?:competition|competitive)[^.!?]*)[.!?]/i;
      const match = enhancedDesc.match(competitionSentencePattern);
      
      if (match) {
        const sentence = match[0];
        const modifiedSentence = sentence.replace(
          /\.$/, 
          " from major competitors like Instagram, Snapchat, YouTube, and Facebook."
        );
        enhancedDesc = enhancedDesc.replace(sentence, modifiedSentence);
        return enhancedDesc;
      }
    }
  }
  
  // Instagram specific enhancement
  if (lowerDesc.includes("instagram")) {
    for (const pattern of vaguePhrases) {
      if (pattern.test(enhancedDesc)) {
        enhancedDesc = enhancedDesc.replace(
          pattern,
          "major competitors like TikTok, Snapchat, YouTube, and Facebook"
        );
        return enhancedDesc;
      }
    }
  }
  
  // For automotive companies
  if (lowerDesc.includes("automotive") || lowerDesc.includes("automaker") || lowerDesc.includes("car manufacturer")) {
    if (lowerDesc.includes("tesla")) {
      for (const pattern of vaguePhrases) {
        if (pattern.test(enhancedDesc)) {
          enhancedDesc = enhancedDesc.replace(
            pattern,
            "major competitors like Volkswagen Group, BYD, Ford, and Rivian"
          );
          return enhancedDesc;
        }
      }
    }
    
    if (lowerDesc.includes("ford")) {
      for (const pattern of vaguePhrases) {
        if (pattern.test(enhancedDesc)) {
          enhancedDesc = enhancedDesc.replace(
            pattern,
            "major competitors like General Motors, Toyota, and Volkswagen"
          );
          return enhancedDesc;
        }
      }
    }
  }
  
  // Generic enhancement for competition sections with various or multiple descriptors
  if (lowerDesc.includes("competition") || lowerDesc.includes("competitive")) {
    for (const pattern of vaguePhrases) {
      if (pattern.test(enhancedDesc)) {
        enhancedDesc = enhancedDesc.replace(
          pattern,
          "key industry competitors"
        );
        return enhancedDesc;
      }
    }
  }
  
  return enhancedDesc;
};

export default MarketAnalysisCard;
