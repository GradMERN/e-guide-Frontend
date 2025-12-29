import { useAuth } from "../../store/hooks";

const AnalyticsCard = ({ title, value,
  icon: Icon,
  trend,
  unit = "",
  bgColor = "from-primary to-secondary",
  onClick = null,
  isLongText = false, 
}) => {
  const { isDarkMode } = useAuth();

  const cardBg = isDarkMode ? "bg-surface" : "bg-white";
  const borderColor = isDarkMode ? "border-border" : "border-gray-200";
  const textColor = isDarkMode ? "text-text" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-text-secondary" : "text-gray-600";

  return (
    <div
      onClick={onClick}
      className={`${cardBg} rounded-xl border ${borderColor} p-5 transition-all h-full flex flex-col justify-between ${
        onClick ? "cursor-pointer hover:shadow-md active:scale-95" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className={`text-[11px] font-bold uppercase tracking-wider ${secondaryText} mb-2`}>
            {title}
          </p>
          
          <div className="flex flex-wrap items-baseline gap-1">
            <h3 
              className={`font-bold ${textColor} leading-tight break-words ${
                isLongText 
                  ? "text-sm md:text-base" // Smaller but full text for tour names
                  : "text-2xl md:text-3xl" // Big size for numbers
              }`}
            >
              {value}
            </h3>
            
            {unit && (
              <span className={`text-xs font-bold ${secondaryText} shrink-0`}>
                {unit}
              </span>
            )}
          </div>

          {trend !== undefined && (
            <p className={`text-xs mt-2 font-bold ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
              {trend >= 0 ? "+" : ""}{trend}% {trend >= 0 ? "↑" : "↓"}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`bg-linear-to-br ${bgColor} p-3 rounded-lg text-white shrink-0 shadow-sm`}>
            <Icon className="text-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;