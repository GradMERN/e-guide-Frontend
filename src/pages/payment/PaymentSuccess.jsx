import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import paymentApi from "../../apis/payment.api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentSuccess = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const sessionId = query.get("session_id");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session id");
      setLoading(false);
      return;
    }

    const confirm = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.confirmPayment(sessionId);
        const data = res?.data;
        setMessage(
          data?.message ||
            (data?.success ? "Payment confirmed" : "Payment confirmed")
        );
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to confirm payment"
        );
      } finally {
        setLoading(false);
      }
    };

    confirm();
  }, [sessionId]);

  // Redirect to My Tours after successful confirmation
  useEffect(() => {
    if (!loading && !error && message) {
      const t = setTimeout(() => {
        navigate("/my-tours");
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [loading, error, message, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div
        className="max-w-xl w-full bg-surface dark:bg-[#151515] rounded-2xl p-8 border"
        style={{ borderColor: "var(--border)" }}
      >
        {loading ? (
          <div className="text-center">
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
            <p className="mt-4 text-text">Confirming payment...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Payment Error</h2>
            <p className="mt-2 text-text-secondary">{error}</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => navigate("/my-tours")}
                className="px-4 py-2 rounded-md bg-primary text-background"
              >
                My Enrollments
              </button>
              <button
                onClick={() => navigate("/tours")}
                className="px-4 py-2 rounded-md border"
                style={{ borderColor: "var(--border)" }}
              >
                Back to Tours
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">
              Payment Confirmed
            </h2>
            <p className="mt-2 text-text-secondary">
              {message ||
                "Your payment was successful and your enrollment is active."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => navigate("/my-tours")}
                className="px-4 py-2 rounded-md bg-primary text-background"
              >
                My Enrollments
              </button>
              <button
                onClick={() => navigate("/tours")}
                className="px-4 py-2 rounded-md border"
                style={{ borderColor: "var(--border)" }}
              >
                Explore Tours
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
