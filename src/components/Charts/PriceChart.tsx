
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceChartProps {
  title: string;
  data: { time: number; value: number }[];
  color?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  dataKey?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  title,
  data,
  color = "#06b6d4",
  valuePrefix = "$",
  valueSuffix = "",
  dataKey = "value"
}) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Format the data for the chart
    const formattedData = data.map(item => ({
      time: new Date(item.time).toLocaleTimeString(),
      [dataKey]: item.value
    }));
    
    setChartData(formattedData);
  }, [data, dataKey]);

  const formatValue = (value: number) => {
    return `${valuePrefix}${value.toLocaleString()}${valueSuffix}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis 
                dataKey="time" 
                stroke="#a0aec0"
                tick={{ fill: '#a0aec0' }}
              />
              <YAxis 
                stroke="#a0aec0" 
                tick={{ fill: '#a0aec0' }}
                tickFormatter={formatValue}
              />
              <Tooltip 
                formatter={(value: number) => [formatValue(value), dataKey]}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#4a5568' }}
                labelStyle={{ color: '#a0aec0' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
