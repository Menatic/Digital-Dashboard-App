
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherChartProps {
  title: string;
  data: { time: number; temperature: number; humidity?: number }[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ title, data }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Format the data for the chart
    const formattedData = data.map(item => ({
      time: new Date(item.time).toLocaleTimeString(),
      temperature: item.temperature,
      humidity: item.humidity || 0
    }));
    
    setChartData(formattedData);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
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
                yAxisId="temp"
                orientation="left"
                tickFormatter={(value) => `${value}°C`}
              />
              {chartData.some(item => item.humidity) && (
                <YAxis
                  stroke="#a0aec0"
                  tick={{ fill: '#a0aec0' }}
                  yAxisId="humidity"
                  orientation="right"
                  tickFormatter={(value) => `${value}%`}
                />
              )}
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'temperature' ? `${value}°C` : `${value}%`,
                  name === 'temperature' ? 'Temperature' : 'Humidity'
                ]}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#4a5568' }}
                labelStyle={{ color: '#a0aec0' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="temperature" 
                fill="#06b6d4" 
                stroke="#06b6d4"
                fillOpacity={0.3}
                yAxisId="temp"
                name="Temperature"
              />
              {chartData.some(item => item.humidity) && (
                <Area 
                  type="monotone" 
                  dataKey="humidity" 
                  fill="#f59e0b" 
                  stroke="#f59e0b"
                  fillOpacity={0.3}
                  yAxisId="humidity"
                  name="Humidity"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherChart;
