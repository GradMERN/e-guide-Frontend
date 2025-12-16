import React from "react";
import { useAuth } from "../../store/hooks";
import AnalyticsCard from "./AnalyticsCard";

const StatsOverview = ({ stats = [] }) => {
  const { isDarkMode } = useAuth();

  // Dynamic grid based on number of stats
  const getGridCols = () => {
    const count = stats.length;
    if (count <= 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 md:grid-cols-3";
    if (count === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
  };

  return (
    <div className={`grid ${getGridCols()} gap-6`}>
      {stats.map((stat, index) => (
        <AnalyticsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          unit={stat.unit}
          bgColor={stat.bgColor}
          onClick={stat.onClick}
        />
      ))}
    </div>
  );
};

export default StatsOverview;
