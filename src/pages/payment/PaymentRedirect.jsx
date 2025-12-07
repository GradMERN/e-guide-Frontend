import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentRedirect = () => {
  const query = useQuery();
  const checkoutUrl = query.get("checkoutUrl") || "";

  useEffect(() => {
    if (!checkoutUrl) return;
    const decoded = decodeURIComponent(checkoutUrl);
    // small delay to show spinner
    const t = setTimeout(() => {
      window.location.href = decoded;
    }, 800);
    return () => clearTimeout(t);
  }, [checkoutUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text">
      <div className="p-8 rounded-2xl bg-surface border border-border text-center">
        <div className="mb-4">
          <svg
            className="animate-spin h-12 w-12 mx-auto text-primary"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Redirecting to payment</h2>
        <p className="text-sm text-text-secondary mt-2">
          You will be redirected to complete your payment.
        </p>
        {!checkoutUrl && (
          <p className="text-sm text-red-500 mt-3">Invalid checkout URL.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentRedirect;
