import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import enrollmentApi from "../../apis/enrollment.api";
import paymentApi from "../../apis/payment.api";
import { toast } from "react-toastify";

const EnrollmentModal = ({ tour, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!isOpen || !tour) return;
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    const doEnroll = async () => {
      try {
        setLoading(true);
        setError(null);

        const enrollRes = await enrollmentApi.enrollTour(tour._id);
        // backend may return an existing pending enrollment under data.enrollment
        const existingEnrollment =
          enrollRes?.data?.data?.enrollment || enrollRes?.data?.enrollment;
        const enrollmentId =
          existingEnrollment?._id ||
          enrollRes?.data?.data?.enrollmentId ||
          enrollRes?.data?.enrollmentId ||
          (enrollRes?.data?.data && enrollRes?.data?.data?.enrollment?._id);
        if (!enrollmentId) {
          onClose?.();
          return;
        }

        const initRes = await paymentApi.initializePayment(enrollmentId);
        const checkoutUrl =
          initRes?.data?.checkoutUrl || initRes?.data?.data?.checkoutUrl;

        if (checkoutUrl) {
          navigate(
            `/payment-redirect?checkoutUrl=${encodeURIComponent(checkoutUrl)}`
          );
        } else if (initRes?.data?.clientSecret) {
          onClose?.();
          toast.success("Payment initialized. Complete payment in the app.");
        } else {
          onClose?.();
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    doEnroll();

    return () => {
      triggeredRef.current = false;
    };
  }, [isOpen, tour, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-md bg-surface dark:bg-[#151515] rounded-xl shadow-lg p-6 border text-center"
        style={{ borderColor: "var(--border)" }}
      >
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
        <h3 className="text-lg font-semibold text-text">
          Redirecting to payment
        </h3>
        <p className="text-text-secondary mt-2">
          We are creating your enrollment and redirecting to complete payment.
        </p>
        {error && <div className="text-sm text-red-500 mt-3">{error}</div>}
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
