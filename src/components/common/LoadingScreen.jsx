import React from "react";
import GoldenSpinner from "./GoldenSpinner";
import { useTranslation } from "react-i18next";

export default function LoadingScreen({
  label,
  size = 56,
  fullScreen = false,
  className = "",
}) {
  const { t } = useTranslation();
  const displayLabel = label || t("common.loading") || "Loading...";

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/90 backdrop-blur-sm">
        <GoldenSpinner size={size} label={displayLabel} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-[400px] w-full flex flex-col items-center justify-center p-4 ${className}`}
    >
      <GoldenSpinner size={size} label={displayLabel} />
    </div>
  );
}
