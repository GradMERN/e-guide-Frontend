import StatCard from "./StatCard";

export default function StatsSection({ stats }) {
  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>
    </section>
  );
}