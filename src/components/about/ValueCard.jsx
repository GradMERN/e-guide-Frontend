export default function ValueCard({ value, index }) {
  const Icon = value.icon;

  return (
    <div className={`fade-up group relative p-8 lg:p-10 glass-effect rounded-2xl linear-border`} style={{ transitionDelay: `${index * 0.2}s` }}>
      <div className="mb-6">
        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#FFD97F] to-[#FFE6A0] flex items-center justify-center shadow-lg shadow-[#FFD97F]/30">
          <Icon className="w-7 h-7 text-black" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-2xl lg:text-3xl font-semibold mb-4 smooth-text text-white group-hover:text-[#FFD97F] transition-colors duration-500">
        {value.title}
      </h3>

      <p className="text-gray-300 text-base lg:text-lg leading-relaxed smooth-text">
        {value.description}
      </p>

      <div className="absolute bottom-0 left-8 right-8 h-1 bg-linear-to-r from-transparent via-[#FFD97F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  );
}
