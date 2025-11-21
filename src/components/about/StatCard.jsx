export default function StatCard({ stat, index }) {
  const Icon = stat.icon;

  return (
    <div className="fade-up text-center group" style={{ transitionDelay: `${index * 0.1}s` }}>
      <div className="mb-6 inline-block">
        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#FFD97F] to-[#FFE6A0] flex items-center justify-center shadow-lg shadow-[#FFD97F]/30">
          <Icon className="w-7 h-7 text-black" strokeWidth={1.5} />
        </div>
      </div>

      <div className="text-6xl lg:text-7xl font-bold mb-4 smooth-text text-[#FFD97F] transition-all duration-500">
        {stat.value}
      </div>

      <div className="text-base lg:text-lg text-gray-400 smooth-text font-medium">
        {stat.label}
      </div>
    </div>
  );
}
