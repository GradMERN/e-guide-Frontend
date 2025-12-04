import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AnalyticsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  unit = '',
  bgColor = 'from-blue-500 to-blue-600',
  onClick = null 
}) => {
  const { isDarkMode } = useAuth();
  
  const cardBg = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div
      onClick={onClick}
      className={`${cardBg} rounded-xl border ${borderColor} p-6 cursor-pointer transition-all hover:shadow-lg ${onClick ? 'hover:scale-105' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${secondaryText} mb-2`}>{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-3xl font-bold ${textColor}`}>{value}</h3>
            {unit && <span className={`text-sm ${secondaryText}`}>{unit}</span>}
          </div>
          {trend !== undefined && (
            <p className={`text-xs mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? '+' : ''}{trend}% {trend >= 0 ? '↑' : '↓'}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`bg-gradient-to-br ${bgColor} p-4 rounded-lg text-white text-2xl flex-shrink-0`}>
            <Icon />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;
