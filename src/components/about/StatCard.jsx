export default function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div
      className="rounded-2xl p-2px bg-slate-800/50 border border-slate-700/50 "
    >
      <div className="bg-slate-900/80 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-linear-to-br from-[#C7A15C] to-[#E2C784] rounded-xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-white" />
        </div>

        <div className="text-4xl font-black text-white">{stat.value}</div>
        <div className="text-gray-400 mt-2">{stat.label}</div>
      </div>
    </div>
  );
}
