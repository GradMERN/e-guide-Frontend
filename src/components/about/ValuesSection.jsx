import ValueCard from "./ValueCard";

export default function ValuesSection({ values = [] }) {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white">Our Values</h2>
          <p className="text-gray-400 mt-4">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <ValueCard key={i} value={value} />
          ))}
        </div>
      </div>
    </section>
  );
}
