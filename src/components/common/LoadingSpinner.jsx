import React from "react";
import GoldenSpinner from "./GoldenSpinner";

/**
 * LoadingSpinner component - unified loading visualization
 * @param {Object} props
 * @param {string} props.size - Size: "sm", "md", "lg", "xl" (default: "md")
 * @param {string} props.text - Optional loading text
 * @param {boolean} props.fullScreen - Whether to show full screen overlay
 */
const LoadingSpinner = ({ size = "md", text = "", fullScreen = false }) => {
  const sizes = {
    sm: 24,
    md: 40,
    lg: 56,
    xl: 72,
  };

  const spinner = <GoldenSpinner size={sizes[size]} label={text || null} />;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * PageLoader - Full page loading state
 */
export const PageLoader = ({ text = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
    <GoldenSpinner size={72} label={text} />
  </div>
);

/**
 * ButtonLoader - Loading spinner for buttons (inline, small)
 */
export const ButtonLoader = () => <GoldenSpinner size={20} />;

export default LoadingSpinner;
