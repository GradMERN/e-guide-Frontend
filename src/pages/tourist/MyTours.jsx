import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import enrollmentApi from "../../apis/enrollment.api";

const MyTours = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // all, active, started, completed

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

  const startEnrollment = async (id) => {
    try {
      await enrollmentApi.startEnrollment(id);
      fetchEnrollments();
    } catch (err) {
      alert(err.message || "Could not start enrollment");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "started":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return <FaClock className="text-blue-500" />;
      case "started":
        return <FaPlay className="text-yellow-500" />;
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const filteredEnrollments = enrollments.filter((e) => {
    if (activeFilter === "all") return true;
    return e.status.toLowerCase() === activeFilter;
  });

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
                    {enrollments.length}
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
                  <p className="text-sm text-text-secondary">Active</p>
                  <p className="text-3xl font-bold text-text mt-1">
                    {enrollments.filter((e) => e.status === "active").length}
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
                  <p className="text-sm text-text-secondary">In Progress</p>
                  <p className="text-3xl font-bold text-text mt-1">
                    {enrollments.filter((e) => e.status === "started").length}
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

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                activeFilter === "all"
                  ? "bg-primary text-background border-primary"
                  : "bg-surface border-border text-text-secondary hover:text-text"
              }`}
            >
              All Tours
            </button>
            <button
              onClick={() => setActiveFilter("active")}
              className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                activeFilter === "active"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-surface border-border text-text-secondary hover:text-text"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveFilter("started")}
              className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                activeFilter === "started"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-surface border-border text-text-secondary hover:text-text"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                activeFilter === "completed"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-surface border-border text-text-secondary hover:text-text"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Enrollments Grid */}
        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface mb-6">
              <FaCalendarAlt className="text-4xl text-text-muted" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">
              {activeFilter === "all"
                ? "No tours enrolled yet"
                : `No ${activeFilter} tours`}
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              {activeFilter === "all"
                ? "You haven't enrolled in any tours yet. Explore our amazing tours and start your adventure!"
                : `You don't have any ${activeFilter} tours at the moment.`}
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
            {filteredEnrollments.map((e) => (
              <div
                key={e._id}
                className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-colors group"
              >
                {/* Tour Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-text mb-2 line-clamp-1">
                        {e.tour?.name || "Unnamed Tour"}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            e.status
                          )}`}
                        >
                          {getStatusIcon(e.status)}
                          {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                        </span>
                        <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {e.tour?.price} {e.tour?.currency || "EGP"}
                        </div>
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
                <div className="px-6 py-4 bg-background/50 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/tours/${e.tour?._id}`}
                      className="px-4 py-2 rounded-lg bg-surface border border-border text-sm font-medium text-text hover:bg-surface/80 transition-colors"
                    >
                      View Tour Details
                    </Link>

                    {e.status === "active" && (
                      <button
                        onClick={() => startEnrollment(e._id)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity hover:scale-105 transition-transform shadow-lg"
                      >
                        Start Tour
                      </button>
                    )}

                    {e.status === "started" && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <FaPlay className="text-sm" />
                        <span className="font-medium">In Progress</span>
                      </div>
                    )}

                    {e.status === "completed" && (
                      <div className="flex items-center gap-2 text-green-600">
                        <FaCheckCircle className="text-sm" />
                        <span className="font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTours;
