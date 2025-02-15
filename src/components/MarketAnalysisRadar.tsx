
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface MarketAnalysisRadarProps {
  marketData: {
    targetUsers: string[];
    marketSize: string;
    entryBarriers: string[];
    keyFeatures: string[];
  };
  index: number;
}

const MarketAnalysisRadar = ({ marketData, index }: MarketAnalysisRadarProps) => {
  // Transform the data for the radar chart
  const radarData = [
    {
      metric: "User Base",
      value: marketData.targetUsers.length * 20,
      fullMark: 100,
    },
    {
      metric: "Market Barriers",
      value: marketData.entryBarriers.length * 25,
      fullMark: 100,
    },
    {
      metric: "Features",
      value: marketData.keyFeatures.length * 20,
      fullMark: 100,
    },
    {
      metric: "Market Potential",
      // Extract the first number from marketSize string and normalize it
      value: parseInt(marketData.marketSize.match(/\d+/)?.[0] || "0"),
      fullMark: 100,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Position Analysis</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <Tooltip />
            <Radar
              name="Market Metrics"
              dataKey="value"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default MarketAnalysisRadar;
