import React, { useState } from "react";
import { FaCalendar, FaUsers } from "react-icons/fa";

const TourBookingCard = ({ tour }) => {
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");

  const handleBooking = () => {
    console.log("Booking:", { tour: tour._id, guests, date });
    // Add booking logic here
  };

  return (
    <div className="sticky top-24">
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10">
        {/* Price */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">From</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold bg-gradient-to-r from-[#FFE6A0] to-[#FFD670] bg-clip-text text-transparent">
              {tour.price}
            </span>
            <span className="text-xl text-gray-300">{tour.currency}</span>
            <span className="text-sm text-gray-400">/ person</span>
          </div>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Select Date
          </label>
          <div className="relative">
            <FaCalendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: "#FFE6A0" }}
              size={14}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/40 rounded-xl text-white text-sm focus:outline-none"
              style={{
                borderColor: "rgba(255, 230, 160, 0.2)",
                borderWidth: "1px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FFE6A0";
                e.target.style.boxShadow = "0 0 0 2px rgba(255, 230, 160, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 230, 160, 0.2)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Guests Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Number of Guests
          </label>
          <div className="relative">
            <FaUsers
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: "#FFE6A0" }}
              size={14}
            />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 bg-black/40 rounded-xl text-white text-sm focus:outline-none appearance-none cursor-pointer"
              style={{
                backgroundImage: "none",
                borderColor: "rgba(255, 230, 160, 0.2)",
                borderWidth: "1px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FFE6A0";
                e.target.style.boxShadow = "0 0 0 2px rgba(255, 230, 160, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 230, 160, 0.2)";
                e.target.style.boxShadow = "none";
              }}
            >
              {[...Array(tour.maxGroupSize)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Total Price */}
        <div
          className="mb-6 p-4 rounded-xl"
          style={{ backgroundColor: "rgba(255, 230, 160, 0.1)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total</span>
            <span className="text-2xl font-bold" style={{ color: "#FFE6A0" }}>
              {tour.price * guests} {tour.currency}
            </span>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          className="w-full py-4 rounded-xl text-gray-900 font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          style={{
            background: "linear-gradient(to right, #FFE6A0, #FFD670)",
            boxShadow: "0 10px 25px -5px rgba(255, 230, 160, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #FFD670, #FFC940)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #FFE6A0, #FFD670)";
          }}
        >
          Book Now
        </button>

        {/* Guarantee */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Free cancellation up to 24 hours before the tour
        </p>
      </div>
    </div>
  );
};

export default TourBookingCard;
