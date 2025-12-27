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
import { useTranslation } from "react-i18next";
import enrollmentApi from "../../apis/enrollment.api";
import paymentApi from "../../apis/payment.api";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/common/LoadingScreen";

const MyTours = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      navigate(`/tour/play/${tourId}`);
    } catch (err) {
      toast.error(err.message || "Could not start enrollment");
    }
  };

  const completePayment = async (enrollmentId) => {
    try {
      const initRes = await paymentApi.initializePayment(enrollmentId);
      const checkoutUrl = initRes?.data?.checkoutUrl || initRes?.data?.data?.checkoutUrl;
      if (!checkoutUrl) throw new Error("Payment initialization failed");
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(err.message || "Could not initialize payment");
    }
  };

  const reEnroll = async (tourId) => {
    try {
      setReEnrollingId(tourId);
      const enrollRes = await enrollmentApi.enrollTour(tourId);
      const existingEnrollment = enrollRes?.data?.data?.enrollment || enrollRes?.data?.enrollment;
      const enrollmentId = existingEnrollment?._id || enrollRes?.data?.data?.enrollmentId;
      
      if (!enrollmentId) throw new Error("Could not create enrollment");

      const initRes = await paymentApi.initializePayment(enrollmentId);
      const checkoutUrl = initRes?.data?.checkoutUrl || initRes?.data?.data?.checkoutUrl;
      if (!checkoutUrl) throw new Error("Payment initialization failed");
      window.location.href = checkoutUrl;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Re-enrollment failed";
      toast.error(msg);
    } finally {
      setReEnrollingId(null);
    }
  };

  const getStatusColor = (status, isExpired = false) => {
    if (isExpired) return "bg-red-500/10 text-red-600 border-red-500/20";
    switch (status.toLowerCase()) {
      case "active": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "started": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "completed": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusIcon = (status, isExpired = false) => {
    if (isExpired) return <FaClock className="text-red-500" />;
    switch (status.toLowerCase()) {
      case "active": return <FaClock className="text-blue-500" />;
      case "started": return <FaPlay className="text-yellow-500" />;
      case "completed": return <FaCheckCircle className="text-green-500" />;
      case "pending": return <FaCreditCard className="text-orange-500" />;
      default: return <FaClock className="text-gray-500" />;
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
    return diffHours > 0 ? `Expires in ${diffHours}h ${diffMins}m` : `Expires in ${diffMins}m`;
  };

  if (loading) return <LoadingScreen fullPage={true} />;

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-8 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-text mb-3">Oops!</h3>
          <p className="text-text-secondary mb-6">{error}</p>
          <button onClick={fetchEnrollments} className="px-6 py-3 rounded-xl bg-primary text-background font-semibold">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-text mb-2">My Tours</h1>
              <p className="text-text-secondary">Manage and track your tour enrollments</p>
            </div>
            <Link to="/tours" className="flex items-center gap-2 px-5 py-3 bg-surface border border-border rounded-xl text-text-secondary hover:text-text transition-colors">
              <span className="font-medium">Browse More Tours</span>
              <FaArrowRight className="text-sm" />
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Tours", val: enrollments.length, icon: <FaCalendarAlt />, color: "primary" },
              { label: "In Progress", val: categorizedEnrollments.inProgress.length, icon: <FaPlay />, color: "yellow-500" },
              { label: "Ready to Start", val: categorizedEnrollments.active.length, icon: <FaClock />, color: "blue-500" },
              { label: "Completed", val: enrollments.filter(e => e.status === "completed").length, icon: <FaCheckCircle />, color: "green-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-surface rounded-2xl p-5 border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                    <p className="text-3xl font-bold text-text mt-1">{stat.val}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}/10 text-${stat.color} text-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollments Grid */}
        {displayedEnrollments.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface mb-6">
              <FaCalendarAlt className="text-4xl text-text-muted" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">No tours enrolled yet</h3>
            <Link to="/tours" className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold">
              Browse Tours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedEnrollments.map((e) => {
              const isExpired = e.expiresAt && new Date(e.expiresAt) < new Date();
              const isPendingValid = e.status === "pending" && new Date(e.createdAt) > new Date(Date.now() - 2 * 60 * 60 * 1000);

              return (
                <div key={e._id} className={`bg-surface rounded-2xl overflow-hidden border transition-all flex flex-col min-h-[350px] ${isExpired ? "opacity-75" : "hover:border-primary/30"}`}>
                  {e.tour?.mainImage?.url && (
                    <div className="w-full h-32 overflow-hidden">
                      <img src={e.tour.mainImage.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold text-text mb-4">{e.tour?.name}</h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getStatusColor(e.status, isExpired)}`}>
                      {getStatusIcon(e.status, isExpired)}
                      {isExpired ? "Expired" : statusLabels[e.status] || e.status}
                    </div>
                    
                    <div className="space-y-2 text-text-secondary text-sm">
                      <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary"/> {e.tour?.place?.city}, {e.tour?.place?.country}</div>
                      {e.expiresAt && !isExpired && <div className="text-xs text-primary">{getExpiryInfo(e.expiresAt)}</div>}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-background/50 border-t border-border/40 flex items-center justify-center gap-3">
                    {isPendingValid && (
                      <button onClick={() => completePayment(e._id)} className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-bold">
                        Pay Now
                      </button>
                    )}
                    {e.status === "active" && !isExpired && (
                      <button onClick={() => startEnrollment(e._id, e.tour?._id)} className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-bold">
                        Start Tour
                      </button>
                    )}
                    {e.status === "started" && !isExpired && (
                      <Link to={`/tour/play/${e.tour?._id}`} className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-bold">
                        Continue
                      </Link>
                    )}
                    {isExpired && (
                      <button onClick={() => reEnroll(e.tour?._id)} disabled={reEnrollingId === e.tour?._id} className="px-4 py-2 rounded-lg bg-secondary text-background text-sm font-bold">
                        {reEnrollingId === e.tour?._id ? "Processing..." : "Re-enroll"}
                      </button>
                    )}
                    <Link to={`/tours/${e.tour?._id}`} className="px-4 py-2 rounded-lg border border-border text-sm">Details</Link>
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