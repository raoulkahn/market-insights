
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

interface Competitor {
  name: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  primaryMarkets: string[];
  fundingStage?: string;
  yearFounded?: string;
}

interface CompetitorComparisonProps {
  companyName: string;
  competitors: Competitor[];
  isExample?: boolean;
}

const CompetitorComparison = ({ companyName, competitors, isExample = false }: CompetitorComparisonProps) => {
  // Enhanced debug logging to help troubleshoot
  console.log(`CompetitorComparison rendering for: ${companyName}`);
  console.log(`Competitors array length: ${competitors?.length || 0}`);
  
  if (competitors?.length > 0) {
    console.log(`First competitor: ${competitors[0]?.name}`);
  } else {
    console.log(`No competitors found for ${companyName}, showing placeholder`);
  }

  // Standardize competitors array to avoid null/undefined issues
  // Always ensure we have at least 3 competitors
  const safeCompetitors = Array.isArray(competitors) && competitors.length > 0 ? competitors : [
    {
      name: "Competitor A",
      marketShare: "~20% estimated market share",
      strengths: ["Brand recognition", "Product innovation", "Market presence"],
      weaknesses: ["Higher pricing", "Limited market reach", "Narrower product range"],
      primaryMarkets: ["Global markets"],
      yearFounded: "2005"
    },
    {
      name: "Competitor B",
      marketShare: "~15% estimated market share",
      strengths: ["Cost leadership", "Distribution network", "Customer loyalty"],
      weaknesses: ["Less brand recognition", "Product quality issues", "Limited innovation"],
      primaryMarkets: ["Regional focus"],
      yearFounded: "2010"
    },
    {
      name: "Competitor C",
      marketShare: "~10% estimated market share",
      strengths: ["Niche specialization", "Customer service", "Agile operations"],
      weaknesses: ["Smaller scale", "Limited resources", "Narrower audience"],
      primaryMarkets: ["Specialized segments"],
      yearFounded: "2015"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mb-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900">Competitive Landscape Comparison</h3>
        <p className="text-gray-600 mt-2">
          Detailed comparison of {companyName} with its main competitors in the market. This analysis highlights
          relative strengths, weaknesses, and market positioning of each competitor.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Share
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key Strengths
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key Weaknesses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Primary Markets
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Main company row */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{companyName}</div>
                {isExample ? (
                  <div className="text-xs text-gray-500">Founded 2003</div>
                ) : null}
              </td>
              <td className="px-6 py-4">
                {isExample ? "14% of global EV market" : "Market Leader"}
              </td>
              <td className="px-6 py-4">
                <ul className="list-disc pl-4 text-sm">
                  {isExample ? (
                    <>
                      <li>Brand recognition</li>
                      <li>Technology leadership</li>
                      <li>Vertical integration</li>
                    </>
                  ) : (
                    <>
                      <li>Strong user base</li>
                      <li>Photo & video sharing</li>
                      <li>Social networking features</li>
                    </>
                  )}
                </ul>
              </td>
              <td className="px-6 py-4">
                <ul className="list-disc pl-4 text-sm">
                  {isExample ? (
                    <>
                      <li>Premium pricing</li>
                      <li>Production constraints</li>
                    </>
                  ) : (
                    <>
                      <li>Algorithm changes</li>
                      <li>Competition in video space</li>
                    </>
                  )}
                </ul>
              </td>
              <td className="px-6 py-4">
                <ul className="list-disc pl-4 text-sm">
                  {isExample ? (
                    <>
                      <li>North America</li>
                      <li>Europe</li>
                      <li>China</li>
                    </>
                  ) : (
                    <li>Global</li>
                  )}
                </ul>
              </td>
            </tr>
            
            {/* Competitor rows */}
            {isExample ? (
              // Example competitors for Tesla
              <>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">Volkswagen Group</div>
                    <div className="text-xs text-gray-500">Founded 1937</div>
                  </td>
                  <td className="px-6 py-4">11% of global EV market</td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Manufacturing scale</li>
                      <li>Global distribution</li>
                      <li>Brand portfolio</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Legacy infrastructure</li>
                      <li>Software capabilities</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Europe</li>
                      <li>China</li>
                      <li>North America</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">BYD</div>
                    <div className="text-xs text-gray-500">Founded 1995</div>
                  </td>
                  <td className="px-6 py-4">18% of global EV market</td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Battery technology</li>
                      <li>Cost leadership</li>
                      <li>Vertical integration</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Limited global presence</li>
                      <li>Brand recognition outside Asia</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      <li>China</li>
                      <li>Asia-Pacific</li>
                      <li>Emerging markets</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">Rivian</div>
                    <div className="text-xs text-gray-500">Founded 2009</div>
                  </td>
                  <td className="px-6 py-4">1% of global EV market</td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Specialized in EV trucks/SUVs</li>
                      <li>Strong backing from investors</li>
                      <li>Adventure-focused brand</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Production ramp challenges</li>
                      <li>Financial sustainability</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      <li>North America</li>
                    </ul>
                  </td>
                </tr>
              </>
            ) : (
              // Map through actual competitors
              safeCompetitors.map((competitor, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{competitor.name}</div>
                    {competitor.yearFounded && (
                      <div className="text-xs text-gray-500">Founded {competitor.yearFounded}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">{competitor.marketShare || "Varies"}</td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      {competitor.strengths && competitor.strengths.length > 0 ? (
                        competitor.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))
                      ) : (
                        <li>Information not available</li>
                      )}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      {competitor.weaknesses && competitor.weaknesses.length > 0 ? (
                        competitor.weaknesses.map((weakness, i) => (
                          <li key={i}>{weakness}</li>
                        ))
                      ) : (
                        <li>Information not available</li>
                      )}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-4 text-sm">
                      {competitor.primaryMarkets && competitor.primaryMarkets.length > 0 ? (
                        competitor.primaryMarkets.map((market, i) => (
                          <li key={i}>{market}</li>
                        ))
                      ) : (
                        <li>Global</li>
                      )}
                    </ul>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CompetitorComparison;
