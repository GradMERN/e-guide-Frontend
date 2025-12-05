import React from "react";

export default function GoogleRedirect() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div
          className="animate-spin rounded-full"
          style={{
            width: 80,
            height: 80,
            borderWidth: 6,
            borderStyle: "solid",
            borderTopColor: "var(--color-primary)",
            borderRightColor: "transparent",
            borderBottomColor: "var(--color-secondary)",
            borderLeftColor: "transparent",
          }}
          aria-hidden="true"
        />

        <p className="mt-4 text-base" style={{ color: "var(--color-text)" }}>
          Redirecting to Google...
        </p>
      </div>
    </div>
  );
}
