import React from "react";
import { useAuth } from "../../store/hooks";
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
} from "recharts";

const ChartComponent = ({
  type = "line",
  data = [],
  title = "",
  dataKey = "value",
  xAxisKey = "name",
  height = 300,
  colors = ["#D5B36A", "#C7A15C", "#E2C784"],
}) => {
  const { isDarkMode } = useAuth();

  const chartBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "#ffffff" : "#000000";
  const gridColor = isDarkMode ? "#333333" : "#e0e0e0";

  const commonProps = {
    width: "100%",
    height,
    data,
    margin: { top: 5, right: 30, left: 0, bottom: 5 },
  };

  const axisProps = {
    stroke: textColor,
    style: { fontSize: "12px" },
  };

  // If no data, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className={`${chartBg} rounded-xl border ${borderColor} p-6`}>
        {title && (
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
        )}
        <div className="flex items-center justify-center" style={{ height }}>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            No data available
          </p>
        </div>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff",
    border: `1px solid ${isDarkMode ? "#D5B36A" : "#e0e0e0"}`,
    borderRadius: "8px",
    padding: "10px 14px",
    boxShadow: isDarkMode
      ? "0 4px 12px rgba(0,0,0,0.4)"
      : "0 4px 12px rgba(0,0,0,0.1)",
  };

  const tooltipLabelStyle = {
    color: isDarkMode ? "#D5B36A" : "#333",
    fontWeight: "600",
    marginBottom: "4px",
  };

  const tooltipItemStyle = {
    color: isDarkMode ? "#e0e0e0" : "#666",
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey={xAxisKey} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
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
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case "line":
      default:
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey={xAxisKey} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
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
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
      )}
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
