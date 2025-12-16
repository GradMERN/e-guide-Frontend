import React from "react";

/**
 * LoadingSpinner component with multiple variants
 * @param {Object} props
 * @param {string} props.size - Size: "sm", "md", "lg", "xl" (default: "md")
 * @param {string} props.variant - Variant: "primary", "gold", "white" (default: "gold")
 * @param {string} props.text - Optional loading text
 * @param {boolean} props.fullScreen - Whether to show full screen overlay
 */
const LoadingSpinner = ({
  size = "md",
  variant = "gold",
  text = "",
  fullScreen = false,
}) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-14 w-14 border-4",
    xl: "h-20 w-20 border-4",
  };

  const variants = {
    primary: "border-[var(--primary)] border-t-transparent",
    gold: "border-[#D5B36A] border-t-transparent",
    white: "border-white border-t-transparent",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full ${sizes[size]} ${variants[variant]}`}
      />
      {text && (
        <p className="text-[var(--text-secondary)] text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

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
    <LoadingSpinner size="xl" text={text} />
  </div>
);

/**
 * ButtonLoader - Loading spinner for buttons
 */
export const ButtonLoader = () => (
  <div className="flex items-center gap-2">
    <LoadingSpinner size="sm" variant="white" />
    <span>Loading...</span>
  </div>
);

export default LoadingSpinner;
