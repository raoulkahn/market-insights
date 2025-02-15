
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full bg-[#F1F0FB] border-none shadow-sm">
        <CardHeader className="pb-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
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

export default MarketAnalysisCard;
