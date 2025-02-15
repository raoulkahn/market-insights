
import { motion } from "framer-motion";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AnalyticsData {
  date: string;
  total_analyses: number;
  unique_companies: number;
  total_downloads: number;
  avg_response_time: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData[];
  isVisible: boolean;
}

const AnalyticsDashboard = ({ data, isVisible }: AnalyticsDashboardProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Analysis Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_analyses" stroke="#2563eb" name="Total Analyses" />
              <Line type="monotone" dataKey="unique_companies" stroke="#16a34a" name="Unique Companies" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Downloads vs Analyses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_analyses" fill="#2563eb" name="Total Analyses" />
              <Bar dataKey="total_downloads" fill="#16a34a" name="PDF Downloads" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Analytics</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Analyses</TableHead>
                <TableHead>Unique Companies</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Avg. Response Time (ms)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.total_analyses}</TableCell>
                  <TableCell>{row.unique_companies}</TableCell>
                  <TableCell>{row.total_downloads}</TableCell>
                  <TableCell>{row.avg_response_time}ms</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnalyticsDashboard;
