export default function ValueCard({ value }) {
  if (!value || !value.icon) return null;

  const Icon = value.icon;

  return (
    <div className="rounded-2xl p-2px bg-slate-800/50 border border-slate-700/50">
      <div className="bg-slate-900/80 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-linear-to-br from-[#C7A15C] to-[#E2C784] rounded-xl flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl text-white font-bold mb-3">{value.title}</h3>
        <p className="text-gray-400">{value.description}</p>
      </div>
    </div>
  );
}
