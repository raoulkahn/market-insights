
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink, Image as ImageIcon } from "lucide-react";

type NewsArticle = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedDate: string;
};

type NewsSectionProps = {
  companyName: string;
  articles: NewsArticle[];
  isLoading: boolean;
  companyImageUrl?: string;
};

const NewsSection = ({ companyName, articles, isLoading, companyImageUrl }: NewsSectionProps) => {
  const [imageError, setImageError] = useState(false);
  
  if (isLoading) {
    return (
      <div className="mt-12 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full">
          <Newspaper className="w-4 h-4 mr-2" />
          <span>Loading news articles...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <div className="text-center mb-8">
        <span className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium shadow-sm inline-flex items-center">
          <Newspaper className="w-4 h-4 mr-2" />
          Latest News for {companyName}
        </span>
      </div>
      
      {companyImageUrl && !imageError && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative overflow-hidden rounded-lg shadow-md max-w-2xl">
            <img 
              src={companyImageUrl} 
              alt={`${companyName}'s product or service`}
              className="w-full h-auto object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-medium">{companyName}'s flagship product</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {(!articles || articles.length === 0) && !isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-full">
            <Newspaper className="w-4 h-4 mr-2" />
            <span>There are no relevant news articles at the moment.</span>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {article.source} • {new Date(article.publishedDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                  >
                    Read full article
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NewsSection;
