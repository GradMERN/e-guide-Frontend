import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ChartComponent = ({
  type = 'line',
  data = [],
  title = '',
  dataKey = 'value',
  height = 300,
  colors = ['#D5B36A', '#C7A15C', '#E2C784'],
}) => {
  const { isDarkMode } = useAuth();

  const chartBg = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const gridColor = isDarkMode ? '#333333' : '#e0e0e0';

  const commonProps = {
    width: '100%',
    height,
    data,
    margin: { top: 5, right: 30, left: 0, bottom: 5 },
  };

  const axisProps = {
    stroke: textColor,
    style: { fontSize: '12px' },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1B1A17' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#D5B36A' : '#ccc'}`,
                  color: textColor,
                }}
              />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1B1A17' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#D5B36A' : '#ccc'}`,
                  color: textColor,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'line':
      default:
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1B1A17' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#D5B36A' : '#ccc'}`,
                  color: textColor,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ fill: colors[0], r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className={`${chartBg} rounded-xl border ${borderColor} p-6`}>
      {title && (
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      )}
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
