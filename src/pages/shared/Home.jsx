import React from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{t("welcome")}</h1>
    </div>
  );
};

export default Home;
