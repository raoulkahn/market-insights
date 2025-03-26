
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
  // Always enhance the description with competitor information regardless of title
  // This ensures competition analysis is present for all companies
  const enhancedDescription = enhanceCompetitionDescription(description, title);

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

// Completely reimplemented competitor information function
const enhanceCompetitionDescription = (description: string, title: string): string => {
  const lowerDescription = description.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  // Don't modify if the description already contains specific competitor information
  if (containsSpecificCompetitors(lowerDescription)) {
    return description;
  }
  
  // Add company-specific competitor information
  if (isSocialMediaCompany(lowerDescription, lowerTitle)) {
    if (containsCompany(lowerDescription, ['tiktok', 'tik tok'])) {
      return addCompetitors(description, ["Instagram", "Snapchat", "YouTube", "Facebook"]);
    } else if (containsCompany(lowerDescription, ['instagram'])) {
      return addCompetitors(description, ["TikTok", "Snapchat", "Pinterest", "Facebook"]);
    } else if (containsCompany(lowerDescription, ['facebook', 'meta'])) {
      return addCompetitors(description, ["Instagram", "TikTok", "Snapchat", "YouTube"]);
    } else if (containsCompany(lowerDescription, ['snapchat'])) {
      return addCompetitors(description, ["Instagram", "TikTok", "BeReal", "Facebook"]);
    } else if (containsCompany(lowerDescription, ['twitter', 'x'])) {
      return addCompetitors(description, ["Facebook", "Instagram", "Threads", "Bluesky"]);
    }
  } else if (isAutomotiveCompany(lowerDescription, lowerTitle)) {
    if (containsCompany(lowerDescription, ['bmw'])) {
      return addCompetitors(description, ["Mercedes-Benz", "Audi", "Lexus", "Tesla"]);
    } else if (containsCompany(lowerDescription, ['mercedes', 'mercedes-benz'])) {
      return addCompetitors(description, ["BMW", "Audi", "Lexus", "Tesla"]);
    } else if (containsCompany(lowerDescription, ['tesla'])) {
      return addCompetitors(description, ["Volkswagen Group", "BYD", "Ford", "Rivian"]);
    } else if (containsCompany(lowerDescription, ['toyota'])) {
      return addCompetitors(description, ["Honda", "Volkswagen", "Ford", "Hyundai"]);
    } else if (containsCompany(lowerDescription, ['ford'])) {
      return addCompetitors(description, ["General Motors", "Toyota", "Volkswagen"]);
    }
  } else if (isTechCompany(lowerDescription, lowerTitle)) {
    if (containsCompany(lowerDescription, ['apple'])) {
      return addCompetitors(description, ["Samsung", "Microsoft", "Google", "Huawei"]);
    } else if (containsCompany(lowerDescription, ['microsoft'])) {
      return addCompetitors(description, ["Apple", "Google", "Amazon", "IBM"]);
    } else if (containsCompany(lowerDescription, ['google'])) {
      return addCompetitors(description, ["Apple", "Microsoft", "Amazon", "Meta"]);
    } else if (containsCompany(lowerDescription, ['amazon'])) {
      return addCompetitors(description, ["Walmart", "Alibaba", "Microsoft", "Google"]);
    }
  }
  
  // Generic default competitor enhancement for any other company
  if (isCompetitionRelated(lowerTitle, lowerDescription)) {
    return addGenericCompetitors(description);
  }
  
  // For market position analysis or any other section, always add a competition reference
  return ensureCompetitionMentioned(description);
};

// Helper function to check if the description already contains specific competitor information
const containsSpecificCompetitors = (text: string): boolean => {
  const specificCompanies = [
    'instagram', 'snapchat', 'tiktok', 'facebook', 'youtube', 'twitter',
    'mercedes', 'bmw', 'audi', 'tesla', 'toyota', 'volkswagen', 'ford',
    'apple', 'google', 'microsoft', 'amazon'
  ];
  
  // Return true if at least 2 specific companies are mentioned (this suggests competitors are already listed)
  let count = 0;
  for (const company of specificCompanies) {
    if (text.includes(company)) {
      count++;
      if (count >= 2) return true;
    }
  }
  
  return false;
};

// Helper to determine if this is a social media company
const isSocialMediaCompany = (description: string, title: string): boolean => {
  const socialKeywords = ['social media', 'platform', 'network', 'photo sharing', 'video sharing', 'content creator'];
  return socialKeywords.some(keyword => description.includes(keyword) || title.includes(keyword));
};

// Helper to determine if this is an automotive company
const isAutomotiveCompany = (description: string, title: string): boolean => {
  const autoKeywords = ['automotive', 'car', 'vehicle', 'automobile', 'automaker', 'manufacturer', 'electric vehicle', 'ev'];
  return autoKeywords.some(keyword => description.includes(keyword) || title.includes(keyword));
};

// Helper to determine if this is a tech company
const isTechCompany = (description: string, title: string): boolean => {
  const techKeywords = ['tech', 'technology', 'software', 'hardware', 'electronics', 'digital', 'computer', 'smartphone'];
  return techKeywords.some(keyword => description.includes(keyword) || title.includes(keyword));
};

// Helper to check if the text contains a specific company reference
const containsCompany = (text: string, names: string[]): boolean => {
  return names.some(name => text.includes(name));
};

// Helper to determine if this is a competition-related section
const isCompetitionRelated = (title: string, description: string): boolean => {
  const competitionTerms = [
    'competition', 'competitive', 'market position', 'landscape', 'overview', 
    'competitor', 'rival', 'market share', 'industry player'
  ];
  
  return competitionTerms.some(term => 
    title.includes(term) || description.includes(term)
  );
};

// Add specific competitors to the description
const addCompetitors = (description: string, competitors: string[]): string => {
  const competitorText = competitors.join(", ");
  
  // Check for existing competition-related content
  const competitionPattern = /([^.!?]*(?:competition|competitive|competitor|compete|rivalry|market position)[^.!?]*)[.!?]/i;
  const match = description.match(competitionPattern);
  
  if (match) {
    // Modify existing competition sentence
    const sentence = match[0];
    const modifiedSentence = sentence.replace(
      /\.$/, 
      " from major competitors like " + competitorText + "."
    );
    return description.replace(sentence, modifiedSentence);
  } else {
    // Add new competition sentence
    if (description.endsWith(".")) {
      return description + " It faces competition from major competitors like " + competitorText + ".";
    } else {
      return description + ". It faces competition from major competitors like " + competitorText + ".";
    }
  }
};

// Add generic competitor information
const addGenericCompetitors = (description: string): string => {
  // Replace vague competitor references with more specific language
  const vaguePhrases = [
    /\b(various|multiple|several|many|different) (social media platforms|platforms|competitors|companies|players|brands)\b/i,
    /\b(faces|experiencing|has|with) (competition|competitive pressure)\b/i,
    /\b(other|leading|major) (platforms|competitors|players|brands)\b/i,
    /\b(increasing|growing|significant|intense) competition\b/i
  ];
  
  for (const pattern of vaguePhrases) {
    if (pattern.test(description)) {
      return description.replace(pattern, "key industry competitors");
    }
  }
  
  return description;
};

// Ensure any description mentions competition
const ensureCompetitionMentioned = (description: string): string => {
  // Only add if no competition is mentioned
  if (!/competition|competitive|competitor|compete|rivalry|market position/i.test(description)) {
    if (description.endsWith(".")) {
      return description + " The company operates in a competitive market with several established players.";
    } else {
      return description + ". The company operates in a competitive market with several established players.";
    }
  }
  
  return description;
};

export default MarketAnalysisCard;
