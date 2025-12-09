import React from "react";

// Simple golden spinner that respects theme colors defined in `src/index.css`.
// Props: `size` (number pixels, default 40), `label` (optional string/element).
const GoldenSpinner = ({ size = 40, label = null }) => {
  const s = `${size}px`;
  const ringStyle = {
    width: s,
    height: s,
    borderRadius: "50%",
    border: `${Math.max(3, Math.round(size / 10))}px solid rgba(0,0,0,0.08)`,
    borderTopColor: "var(--primary)",
    borderRightColor: "var(--secondary)",
    borderBottomColor: "var(--tertiary)",
    boxSizing: "border-box",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin" style={ringStyle} aria-hidden="true" />
      {label ? (
        <div className="mt-3 text-[var(--text-secondary)] text-sm">{label}</div>
      ) : null}
    </div>
  );
};

export default GoldenSpinner;
