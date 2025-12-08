import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";
import { LuUsers } from "react-icons/lu";
import { FaAward } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { IoStarOutline } from "react-icons/io5";

export default function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: LuUsers,
      value: "50K+",
      label: "Happy Travelers",
      color: "text-amber-400",
    },
    {
      icon: FaAward,
      value: "15+",
      label: "Years Experience",
      color: "text-orange-400",
    },
    {
      icon: LuMapPin,
      value: "100+",
      label: "Destinations",
      color: "text-yellow-400",
    },
    {
      icon: IoStarOutline,
      value: "4.9",
      label: "Average Rating",
      color: "text-amber-300",
    },
  ];

  return (
    <section className="py-6 lg:py-12 relative border-y border-white/4 mb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}