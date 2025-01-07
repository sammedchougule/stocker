import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProfitLossChartProps {
  data: any[];
}

const ProfitLossChart: React.FC<ProfitLossChartProps> = ({ data }) => {
  const chartData = data
    .filter(item => item[''] !== 'TTM') // Exclude TTM row
    .map(item => ({
      year: item[''] || 'N/A',
      Sales: parseFloat(item['Sales +']) || 0,
      Expenses: parseFloat(item['Expenses +']) || 0,
      'Operating Profit': parseFloat(item['Operating Profit']) || 0,
      'Profit before tax': parseFloat(item['Profit before tax']) || 0,
      'Net Profit': parseFloat(item['Net Profit +']) || 0,
    }))
    .reverse(); // Reverse the array to show oldest data first

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Sales" fill="#8884d8" />
        <Bar dataKey="Expenses" fill="#82ca9d" />
        <Bar dataKey="Operating Profit" fill="#ffc658" />
        <Bar dataKey="Profit before tax" fill="#ff7300" />
        <Bar dataKey="Net Profit" fill="#00C49F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProfitLossChart;

