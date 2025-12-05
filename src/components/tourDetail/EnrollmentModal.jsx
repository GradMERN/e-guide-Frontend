// components/tourDetail/EnrollmentModal.jsx
import React, { useState } from "react";
import {
  FaTimes,
  FaCalendar,
  FaUsers,
  FaCreditCard,
  FaCheck,
} from "react-icons/fa";

const EnrollmentModal = ({ tour, isOpen, onClose }) => {
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const totalPrice = tour.price * guests;
  const maxGuests = tour.maxGroupSize || 12;

  const handleEnroll = () => {
    alert(`Enrollment confirmed for ${guests} guest(s) on ${date}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-text">Enroll in Tour</h2>
            <p className="text-text-secondary">Complete your enrollment</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background transition-colors"
          >
            <FaTimes className="text-text-secondary" size={20} />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= stepNum
                        ? "bg-gradient-to-r from-primary to-secondary text-background"
                        : "bg-background border border-border text-text-secondary"
                    }`}
                  >
                    {step > stepNum ? <FaCheck size={14} /> : stepNum}
                  </div>
                  <span className="text-xs mt-2 text-text-secondary">
                    {stepNum === 1
                      ? "Details"
                      : stepNum === 2
                      ? "Payment"
                      : "Confirm"}
                  </span>
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      step > stepNum ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text mb-4">
                  Tour Details
                </h3>
                <div className="bg-background rounded-xl p-4 mb-4">
                  <h4 className="font-bold text-text text-lg mb-2">
                    {tour.name}
                  </h4>
                  <p className="text-text-secondary">
                    {tour.place?.city || "Unknown"},{" "}
                    {tour.place?.country || "Egypt"}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-text">
                      {tour.duration || 8} hours
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tour.difficulty === "easy"
                          ? "bg-green-500/20 text-green-700"
                          : tour.difficulty === "moderate"
                          ? "bg-yellow-500/20 text-yellow-700"
                          : "bg-red-500/20 text-red-700"
                      }`}
                    >
                      {tour.difficulty || "Moderate"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <FaCalendar className="text-primary" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-background rounded-xl border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <FaUsers className="text-secondary" />
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full p-3 bg-background rounded-xl border border-border text-text focus:outline-none focus:border-primary"
                  >
                    {[...Array(Math.min(maxGuests, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-background rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Price per person</span>
                  <span className="font-semibold text-text">
                    {tour.price} {tour.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {totalPrice} {tour.currency}
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">
                Payment Information
              </h3>
              <p className="text-text-secondary mb-6">
                Secure payment will be processed on the next step.
              </p>
              <div className="bg-background rounded-xl p-4">
                <p className="text-text">
                  Total Amount:{" "}
                  <span className="font-bold">
                    {totalPrice} {tour.currency}
                  </span>
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-background" size={24} />
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Ready to Enroll!
              </h3>
              <p className="text-text-secondary mb-6">
                Review your enrollment details and confirm to secure your spot.
              </p>
              <div className="bg-background rounded-xl p-4 text-left">
                <p className="font-semibold text-text">{tour.name}</p>
                <p className="text-text-secondary text-sm mt-1">
                  {date || "Select a date"}
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  {guests} {guests === 1 ? "Guest" : "Guests"}
                </p>
                <p className="font-bold text-text mt-2">
                  {totalPrice} {tour.currency}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="px-6 py-2 rounded-xl border border-border text-text hover:bg-background transition-colors"
          >
            {step > 1 ? "Back" : "Cancel"}
          </button>

          <button
            onClick={() => (step < 3 ? setStep(step + 1) : handleEnroll())}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity"
          >
            {step < 3 ? "Continue" : "Confirm Enrollment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
