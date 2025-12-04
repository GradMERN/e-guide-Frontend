import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AnalyticsCard from './AnalyticsCard';

const StatsOverview = ({ stats = [] }) => {
  const { isDarkMode } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
