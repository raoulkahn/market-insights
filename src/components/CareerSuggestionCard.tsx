
import { motion } from "framer-motion";

interface CompetitiveAnalysisCardProps {
  title: string;
  description: string;
  index: number;
  marketData?: {
    targetUsers: string[];
    marketSize: string;
    entryBarriers: string[];
    keyFeatures: string[];
  };
}

const CompetitiveAnalysisCard = ({ title, description, index, marketData }: CompetitiveAnalysisCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative w-full max-w-md p-6 overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
    >
      <div className="space-y-4">
        <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
          Market Analysis {index + 1}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
        
        {marketData && (
          <div className="space-y-4 pt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Target Users:</h4>
              <div className="flex flex-wrap gap-2">
                {marketData.targetUsers.map((user, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full border border-blue-100"
                  >
                    {user}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Market Size:</h4>
              <p className="text-sm text-gray-600">{marketData.marketSize}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Entry Barriers:</h4>
              <div className="flex flex-wrap gap-2">
                {marketData.entryBarriers.map((barrier, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-full border border-red-100"
                  >
                    {barrier}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Required Features:</h4>
              <div className="flex flex-wrap gap-2">
                {marketData.keyFeatures.map((feature, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs bg-green-50 text-green-600 rounded-full border border-green-100"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompetitiveAnalysisCard;
