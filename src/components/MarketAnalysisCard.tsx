
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
  // Check if this is a competition analysis card using broader criteria
  const isCompetitionAnalysis = 
    title.toLowerCase().includes("competition") || 
    title.toLowerCase().includes("competitive") ||
    title.toLowerCase().includes("landscape") ||
    title.toLowerCase().includes("overview") ||
    title.toLowerCase().includes("market position") ||
    description.toLowerCase().includes("competition") ||
    description.toLowerCase().includes("competitor");
  
  // Check for specific company mentions
  const lowerDescription = description.toLowerCase();
  const isTikTokAnalysis = lowerDescription.includes("tik tok") || lowerDescription.includes("tiktok");
  const isInstagramAnalysis = lowerDescription.includes("instagram");
  
  // Enhanced description with specific competitor names based on company
  const enhancedDescription = isCompetitionAnalysis 
    ? enhanceCompetitionDescription(description, isTikTokAnalysis, isInstagramAnalysis)
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
const enhanceCompetitionDescription = (
  description: string, 
  isTikTokAnalysis: boolean, 
  isInstagramAnalysis: boolean
): string => {
  let enhancedDesc = description;
  
  // Generic patterns that indicate vague competitor references
  const vaguePhrases = [
    /\b(various|multiple|several|many|different) (social media platforms|platforms|competitors|companies|players|brands)\b/i,
    /\b(faces|experiencing|has|with) (competition|competitive pressure)\b/i,
    /\b(other|leading|major) (platforms|competitors|players|brands)\b/i,
    /\b(increasing|growing|significant|intense) competition\b/i
  ];
  
  // More comprehensive patterns for improving detection
  const competitionSentencePattern = /([^.!?]*(?:competition|competitive|competitor|compete)[^.!?]*)[.!?]/i;
  
  // TikTok specific enhancement
  if (isTikTokAnalysis) {
    const tiktokCompetitors = "major competitors like Instagram, Snapchat, YouTube, and Facebook";
    
    // First try to match vague phrases
    for (const pattern of vaguePhrases) {
      if (pattern.test(enhancedDesc)) {
        enhancedDesc = enhancedDesc.replace(pattern, tiktokCompetitors);
        return enhancedDesc;
      }
    }
    
    // Try to find a sentence mentioning competition
    const match = enhancedDesc.match(competitionSentencePattern);
    if (match) {
      const sentence = match[0];
      const modifiedSentence = sentence.replace(
        /\.$/, 
        " from " + tiktokCompetitors + "."
      );
      enhancedDesc = enhancedDesc.replace(sentence, modifiedSentence);
      return enhancedDesc;
    }
    
    // If no match was found but we know it's about TikTok, append competitor info
    if (!enhancedDesc.includes("Instagram") && !enhancedDesc.includes("Snapchat")) {
      if (enhancedDesc.endsWith(".")) {
        enhancedDesc += " It competes with " + tiktokCompetitors + ".";
      } else {
        enhancedDesc += ". It competes with " + tiktokCompetitors + ".";
      }
      return enhancedDesc;
    }
  }
  
  // Instagram specific enhancement - improved to ensure it gets detected
  if (isInstagramAnalysis) {
    const instagramCompetitors = "major competitors like TikTok, Snapchat, YouTube, and Facebook";
    
    // First try to match vague phrases
    for (const pattern of vaguePhrases) {
      if (pattern.test(enhancedDesc)) {
        enhancedDesc = enhancedDesc.replace(pattern, instagramCompetitors);
        return enhancedDesc;
      }
    }
    
    // Try to find a sentence mentioning competition
    const match = enhancedDesc.match(competitionSentencePattern);
    if (match) {
      const sentence = match[0];
      const modifiedSentence = sentence.replace(
        /\.$/,
        " from " + instagramCompetitors + "."
      );
      enhancedDesc = enhancedDesc.replace(sentence, modifiedSentence);
      return enhancedDesc;
    }
    
    // If no match was found but we know it's about Instagram, append competitor info
    if (!enhancedDesc.includes("TikTok") && !enhancedDesc.includes("Snapchat")) {
      if (enhancedDesc.endsWith(".")) {
        enhancedDesc += " It competes with " + instagramCompetitors + ".";
      } else {
        enhancedDesc += ". It competes with " + instagramCompetitors + ".";
      }
      return enhancedDesc;
    }
  }
  
  // For automotive companies
  if (description.toLowerCase().includes("automotive") || 
      description.toLowerCase().includes("automaker") || 
      description.toLowerCase().includes("car manufacturer")) {
    if (description.toLowerCase().includes("tesla")) {
      const teslaCompetitors = "major competitors like Volkswagen Group, BYD, Ford, and Rivian";
      
      for (const pattern of vaguePhrases) {
        if (pattern.test(enhancedDesc)) {
          enhancedDesc = enhancedDesc.replace(pattern, teslaCompetitors);
          return enhancedDesc;
        }
      }
      
      // Try to find a sentence about competition
      const match = enhancedDesc.match(competitionSentencePattern);
      if (match) {
        const sentence = match[0];
        const modifiedSentence = sentence.replace(/\.$/, " from " + teslaCompetitors + ".");
        enhancedDesc = enhancedDesc.replace(sentence, modifiedSentence);
        return enhancedDesc;
      }
    }
    
    if (description.toLowerCase().includes("ford")) {
      const fordCompetitors = "major competitors like General Motors, Toyota, and Volkswagen";
      
      for (const pattern of vaguePhrases) {
        if (pattern.test(enhancedDesc)) {
          enhancedDesc = enhancedDesc.replace(pattern, fordCompetitors);
          return enhancedDesc;
        }
      }
      
      // Try to find a sentence about competition
      const match = enhancedDesc.match(competitionSentencePattern);
      if (match) {
        const sentence = match[0];
        const modifiedSentence = sentence.replace(/\.$/, " from " + fordCompetitors + ".");
        enhancedDesc = enhancedDesc.replace(sentence, modifiedSentence);
        return enhancedDesc;
      }
    }
  }
  
  // Generic enhancement for competition sections
  if (enhancedDesc.toLowerCase().includes("competition") || enhancedDesc.toLowerCase().includes("competitive")) {
    for (const pattern of vaguePhrases) {
      if (pattern.test(enhancedDesc)) {
        enhancedDesc = enhancedDesc.replace(pattern, "key industry competitors");
        return enhancedDesc;
      }
    }
  }
  
  return enhancedDesc;
};

export default MarketAnalysisCard;
