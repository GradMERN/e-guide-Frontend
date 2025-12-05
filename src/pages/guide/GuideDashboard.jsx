import React from "react";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  return <div className="p-6">{t("guide.dashboard") || "Dashboard"}</div>;
};

export default Dashboard;
