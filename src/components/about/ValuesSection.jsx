import ValueCard from "./ValueCard";
export default function ValuesSection({ values }) {
  return (
    <section className="py-16 lg:py-20 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#FFD97F]/10 rounded-full blur-[120px]"></div>{" "}
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#FFE6A0]/10 rounded-full blur-[120px]"></div>{" "}
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-24 fade-up">
          <span className="inline-block text-sm tracking-[0.3em] text-[#FFD97F] uppercase font-medium mb-6 smooth-text">
            What Sets Us Apart
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-8 smooth-text">
            Our Core
            <span className="font-semibold bg-linear-to-r from-[#FFD97F] to-[#FFE6A0] bg-clip-text text-transparent">
              Values
            </span>
          </h2>
          <p className="text-gray-300 text-xl lg:text-2xl max-w-3xl mx-auto smooth-text leading-relaxed">
            Six principles that guide every expedition we create
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, i) => (
            <ValueCard key={i} value={value} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
