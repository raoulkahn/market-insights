
import { motion } from "framer-motion";

interface CareerSuggestionCardProps {
  title: string;
  description: string;
  index: number;
}

const CareerSuggestionCard = ({ title, description, index }: CareerSuggestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative w-full max-w-md p-6 overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
    >
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
          Suggestion {index + 1}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default CareerSuggestionCard;
