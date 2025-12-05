import React, { useState } from "react";
import { FaCalendar, FaUsers } from "react-icons/fa";

const TourBookingCard = ({ tour }) => {
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");

  const handleBooking = () => {
    console.log("Booking:", { tour: tour._id, guests, date });
    // Add booking logic here
    alert(`Booking confirmed for ${guests} guest(s) on ${date}`);
  };

  return (
    <div className="relative">
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-xl">
        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              {tour.price}
            </span>
            <span className="text-xl text-text-secondary">{tour.currency}</span>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary text-background"
        >
          Enroll Now
        </button>

        {/* Guarantee */}
        <div className="pt-6 mt-6 border-t border-border">
          <p className="text-sm text-center text-text-muted">
            ⭐ Free cancellation up to 24 hours before the tour
          </p>
          <p className="text-xs text-center text-text-muted mt-2">
            {tour.enrollmentsCount || 0} travelers have booked this tour
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourBookingCard;
