
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
  // Transform the data for the bar chart
  const barData = [
    {
      metric: "Target Users",
      value: marketData.targetUsers.length * 20,
      category: "Users",
    },
    {
      metric: "Entry Barriers",
      value: marketData.entryBarriers.length * 25,
      category: "Market",
    },
    {
      metric: "Key Features",
      value: marketData.keyFeatures.length * 20,
      category: "Product",
    },
    {
      metric: "Market Size",
      // Extract the first number from marketSize string and normalize it
      value: parseInt(marketData.marketSize.match(/\d+/)?.[0] || "0"),
      category: "Market",
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
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="metric" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{
                fill: "#4B5563",
                fontSize: 12,
                fontWeight: 500
              }}
            />
            <YAxis 
              tick={{
                fill: "#4B5563",
                fontSize: 12
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "0.5rem",
                padding: "0.5rem"
              }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              fill="#3b82f6" 
              name="Score"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default MarketAnalysisRadar;
