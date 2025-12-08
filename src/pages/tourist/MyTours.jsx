import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowRight,
  FaCreditCard,
} from "react-icons/fa";
import enrollmentApi from "../../apis/enrollment.api";
import paymentApi from "../../apis/payment.api";
import { toast } from "react-toastify";

const MyTours = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reEnrollingId, setReEnrollingId] = useState(null);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await enrollmentApi.getUserEnrollments();
      setEnrollments(res?.data?.data?.all || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const categorizedEnrollments = useMemo(() => {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const inProgress = [];
    const active = [];
    const pending = [];
    const expired = [];

    enrollments.forEach((e) => {
      const isExpired = e.expiresAt && new Date(e.expiresAt) < now;
      const isPendingValid =
        e.status === "pending" && new Date(e.createdAt) > twoHoursAgo;

      if (isExpired) {
        expired.push(e);
      } else if (e.status === "started") {
        inProgress.push(e);
      } else if (e.status === "active") {
        active.push(e);
      } else if (isPendingValid) {
        pending.push(e);
      }
    });

    return { inProgress, active, pending, expired };
  }, [enrollments]);

  const displayedEnrollments = useMemo(() => {
    return [
      ...categorizedEnrollments.inProgress,
      ...categorizedEnrollments.active,
      ...categorizedEnrollments.pending,
      ...categorizedEnrollments.expired,
    ];
  }, [categorizedEnrollments]);

  const startEnrollment = async (id, tourId) => {
    try {
      await enrollmentApi.startEnrollment(id);
      fetchEnrollments();
      // Navigate to tour play page
      navigate(`/tour/play/${tourId}`);
    } catch (err) {
      toast.error(err.message || "Could not start enrollment");
    }
  };

  const completePayment = async (enrollmentId, tourId) => {
    try {
      const initRes = await paymentApi.initializePayment(enrollmentId);
      const checkoutUrl =
        initRes?.data?.checkoutUrl || initRes?.data?.data?.checkoutUrl;
      if (!checkoutUrl) throw new Error("Payment initialization failed");
      // Redirect to payment
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(err.message || "Could not initialize payment");
    }
  };

  const reEnroll = async (tourId) => {
    try {
      setReEnrollingId(tourId);
      const enrollRes = await enrollmentApi.enrollTour(tourId);
      const enrollmentId =
        enrollRes?.data?.data?.enrollmentId || enrollRes?.data?.enrollmentId;
      if (!enrollmentId) throw new Error("Could not create enrollment");

      const initRes = await paymentApi.initializePayment(enrollmentId);
      const checkoutUrl =
        initRes?.data?.checkoutUrl || initRes?.data?.data?.checkoutUrl;
      if (!checkoutUrl) throw new Error("Payment initialization failed");
      // Redirect to payment
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error(err);
      const apiMsg = err?.response?.data?.message;
      const status = err?.response?.status;
      const msg = apiMsg || err?.message || "Re-enrollment failed";
      // If backend says already enrolled, navigate to My Tours
      if (status === 400 && /already enrolled/i.test(msg)) {
        toast.info("You are already enrolled in this tour.");
        setTimeout(() => navigate("/my-tours"), 800);
      } else {
        toast.error(msg);
      }
    } finally {
      setReEnrollingId(null);
    }
  };

  const getStatusColor = (status, isExpired = false) => {
    if (isExpired) return "bg-red-500/10 text-red-600 border-red-500/20";
    switch (status.toLowerCase()) {
      case "active":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "started":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusIcon = (status, isExpired = false) => {
    if (isExpired) return <FaClock className="text-red-500" />;
    switch (status.toLowerCase()) {
      case "active":
        return <FaClock className="text-blue-500" />;
      case "started":
        return <FaPlay className="text-yellow-500" />;
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "pending":
        return <FaCreditCard className="text-orange-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const statusLabels = {
    active: "Ready to Start",
    started: "In Progress",
    pending: "Pending Payment",
    completed: "Completed",
  };

  const getExpiryInfo = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    if (expiry <= now) return "Expired";
    const diffMs = expiry - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHours > 0) {
      return `Expires in ${diffHours}h ${diffMins}m`;
    } else {
      return `Expires in ${diffMins}m`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading your tours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-text mb-3">Oops!</h3>
            <p className="text-text-secondary mb-6">{error}</p>
            <button
              onClick={fetchEnrollments}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-44 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-text mb-2">My Tours</h1>
              <p className="text-text-secondary">
                Manage and track your tour enrollments
              </p>
            </div>
            <Link
              to="/tours"
              className="flex items-center gap-2 px-5 py-3 bg-surface border border-border rounded-xl text-text-secondary hover:text-text hover:bg-surface/80 transition-colors"
            >
              <span className="font-medium">Browse More Tours</span>
              <FaArrowRight className="text-sm" />
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total Tours</p>
                  <p className="text-3xl font-bold text-text mt-1">
                    {
                      enrollments.filter(
                        (e) =>
                          !(e.expiresAt && new Date(e.expiresAt) < new Date())
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <FaCalendarAlt className="text-primary text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">In Progress</p>
                  <p className="text-3xl font-bold text-text mt-1">
                    {categorizedEnrollments.inProgress.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-500/10">
                  <FaPlay className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Ready to Start</p>
                  <p className="text-3xl font-bold text-text mt-1">
                    {categorizedEnrollments.active.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <FaClock className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Completed</p>
                  <p className="text-3xl font-bold text-text mt-1">
                    {enrollments.filter((e) => e.status === "completed").length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <FaCheckCircle className="text-green-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollments Grid */}
        {displayedEnrollments.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface mb-6">
              <FaCalendarAlt className="text-4xl text-text-muted" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">
              No tours enrolled yet
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              You haven't enrolled in any tours yet. Explore our amazing tours
              and start your adventure!
            </p>
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity"
            >
              Browse Tours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedEnrollments.map((e) => {
              const now = new Date();
              const isExpired = e.expiresAt && new Date(e.expiresAt) < now;
              const isPendingValid =
                e.status === "pending" &&
                new Date(e.createdAt) >
                  new Date(now.getTime() - 2 * 60 * 60 * 1000);

              return (
                <div
                  key={e._id}
                  className={`bg-surface rounded-2xl overflow-hidden border hover:border-primary/30 transition-colors group flex flex-col min-h-[350px] ${
                    isExpired ? "opacity-75" : ""
                  }`}
                  style={{
                    borderColor: isExpired ? "var(--border)" : undefined,
                  }}
                >
                  {/* Tour Image */}
                  {e.tour?.mainImage?.url && (
                    <div className="w-full h-32 overflow-hidden rounded-t-2xl">
                      <img
                        src={e.tour.mainImage.url}
                        alt={e.tour.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Tour Header */}
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-text mb-2 line-clamp-1">
                          {e.tour?.name || "Unnamed Tour"}
                        </h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                e.status,
                                isExpired
                              )}`}
                            >
                              {getStatusIcon(e.status, isExpired)}
                              {isExpired
                                ? "Expired"
                                : statusLabels[e.status] || e.status}
                            </span>
                            {e.status === "pending" && (
                              <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {e.tour?.price} {e.tour?.currency || "EGP"}
                              </div>
                            )}
                          </div>
                          {e.expiresAt && !isExpired && (
                            <div className="text-xs text-text-secondary ml-3">
                              {getExpiryInfo(e.expiresAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tour Details */}
                    <div className="space-y-3 mb-6">
                      {e.tour?.place && (
                        <div className="flex items-center gap-2 text-text-secondary">
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <FaMapMarkerAlt className="text-primary text-xs" />
                          </div>
                          <span className="text-sm">
                            {e.tour.place.city || "Unknown"},{" "}
                            {e.tour.place.country || "Egypt"}
                          </span>
                        </div>
                      )}

                      {e.tour?.guide && (
                        <div className="flex items-center gap-2 text-text-secondary">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                            {e.tour.guide.firstName?.charAt(0) || "G"}
                          </div>
                          <span className="text-sm">
                            Guide: {e.tour.guide.firstName}{" "}
                            {e.tour.guide.lastName}
                          </span>
                        </div>
                      )}

                      {e.tour?.enrollmentsCount && (
                        <div className="flex items-center gap-2 text-text-secondary">
                          <div className="p-1.5 rounded-lg bg-secondary/10">
                            <FaUsers className="text-secondary text-xs" />
                          </div>
                          <span className="text-sm">
                            {e.tour.enrollmentsCount} travelers
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tour Description */}
                    <p className="text-text-secondary text-sm mb-6 line-clamp-2">
                      {e.tour?.description ||
                        "Discover amazing places with expert guides."}
                    </p>
                  </div>

                  {/* Action Section */}
                  <div className="px-6 py-4 bg-background/50 border-t border-border/40 h-20">
                    <div className="flex items-center justify-center gap-2 h-full">
                      {e.status === "started" ? null : (
                        <Link
                          to={`/tours/${e.tour?._id}`}
                          className="px-4 py-2 rounded-lg bg-surface border border-border text-sm font-medium text-text hover:bg-surface/80 transition-colors h-10 flex items-center justify-center"
                        >
                          View Tour Details
                        </Link>
                      )}

                      {isPendingValid && (
                        <button
                          onClick={() => completePayment(e._id, e.tour?._id)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2 h-10"
                        >
                          <FaCreditCard className="text-sm" />
                          Complete Payment
                        </button>
                      )}

                      {e.status === "active" && !isExpired && (
                        <button
                          onClick={() => startEnrollment(e._id, e.tour?._id)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity hover:scale-105 transition-transform shadow-lg h-10 flex items-center justify-center"
                        >
                          Start Tour
                        </button>
                      )}

                      {e.status === "started" && !isExpired && (
                        <Link
                          to={`/tour/play/${e.tour?._id}`}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity shadow-lg h-10 flex items-center justify-center"
                        >
                          View Tour
                        </Link>
                      )}

                      {e.status === "completed" && (
                        <div className="flex items-center gap-2 text-green-600 h-10 flex items-center justify-center">
                          <FaCheckCircle className="text-sm" />
                          <span className="font-medium">Completed</span>
                        </div>
                      )}
                      {isExpired && (
                        <button
                          onClick={() => reEnroll(e.tour?._id)}
                          disabled={reEnrollingId === e.tour?._id}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity shadow-lg h-10 flex items-center justify-center"
                        >
                          {reEnrollingId === e.tour?._id ? (
                            <span className="flex items-center gap-2">
                              <svg
                                className="animate-spin h-4 w-4"
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
                              Re-enrolling...
                            </span>
                          ) : (
                            "Re-enroll"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTours;
