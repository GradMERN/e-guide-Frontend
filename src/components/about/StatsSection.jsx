import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";
import { LuUsers } from "react-icons/lu";
import { FaAward } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { IoStarOutline } from "react-icons/io5";

export default function StatsSection() {
  const { t } = useTranslation();

  const icons = [LuUsers, FaAward, LuMapPin, IoStarOutline];
  const statsData = t("about.stats.items", { returnObjects: true });

  const stats = statsData.map((item, index) => ({
    icon: icons[index],
    value: item.value,
    label: item.label,
  }));

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