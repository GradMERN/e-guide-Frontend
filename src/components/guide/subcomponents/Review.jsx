import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import reviewService from "../../../apis/reviewService";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const DEFAULT_PAGE_SIZE = 5;

const Star = ({ filled, onClick, size = 18, ariaLabel }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className="p-0 m-0"
    style={{
      background: "transparent",
      border: "none",
      cursor: onClick ? "pointer" : "default",
      padding: 4,
    }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#F6C34A" : "none"}
      stroke={filled ? "#F6C34A" : "var(--text-muted)"}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.177L12 18.896l-7.336 3.858 1.402-8.177L.132 9.21l8.2-1.192L12 .587z" />
    </svg>
  </button>
);

const Review = ({ tourId, enrollment, tour, readOnly = false }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id || null;

  const isRtl =
    (typeof document !== "undefined" &&
      document.documentElement?.dir === "rtl") ||
    false;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const isGuide =
    user &&
    tour &&
    ((tour.guide &&
      typeof tour.guide === "object" &&
      tour.guide._id === user._id) ||
      (tour.guide &&
        typeof tour.guide === "string" &&
        tour.guide === user._id) ||
      (tour.guide && tour.guide === user._id));

  const canPost =
    isGuide ||
    !!(
      enrollment &&
      enrollment.status === "started" &&
      (!enrollment.expiresAt || new Date(enrollment.expiresAt) > new Date())
    );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const response = await reviewService.getTourReviews(tourId);
        const data = response.data || [];
        if (!mounted) return;
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load reviews", err);
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [tourId]);

  // Determine if the current user already submitted a review for this tour
  const userReview = useMemo(() => {
    if (!currentUserId || !reviews || reviews.length === 0) return null;
    return (
      reviews.find((r) => {
        const uid = r.user?._id || r.user?.id || r.user;
        return uid && String(uid) === String(currentUserId);
      }) || null
    );
  }, [reviews, currentUserId]);

  const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize));

  const paginated = reviews.slice((page - 1) * pageSize, page * pageSize);

  const submitReview = async () => {
    if (!canPost) {
      toast.error(
        t("reviews.noPermission", "You don't have permission to post a review")
      );
      return;
    }
    if (userReview) {
      toast.error(
        t(
          "reviews.alreadyReviewed",
          "You have already posted a review for this tour"
        )
      );
      return;
    }
    if (!comment.trim()) {
      toast.error(
        t("reviews.emptyComment", "Please write a comment before posting")
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = { rating, comment };
      const response = await reviewService.createReview(tourId, payload);
      const newReview = response.data;
      // prefer placing at the beginning
      setReviews((p) => [newReview, ...p]);
      setComment("");
      setRating(5);
      setPage(1);
      toast.success(t("reviews.posted", "Review posted successfully!"));
    } catch (err) {
      console.error("Failed to post review", err);
      const errorMessage =
        err.response?.data?.message ||
        t("reviews.postFailed", "Failed to post review");
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
      }}
    >
      <div style={{ padding: 16 }}>
        <div className="flex items-center justify-between">
          <h3
            className="text-lg font-semibold mb-0"
            style={{ color: "var(--text)" }}
          >
            {t("reviews.title", "Reviews")}
          </h3>
          <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {reviews.length} {t("reviews.count", "review")}
            {reviews.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <div style={{ color: "var(--text-muted)" }}>
              {t("reviews.loading", "Loading reviews...")}
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ color: "var(--text-muted)" }}>
              {t("reviews.noReviews", "No reviews yet.")}
            </div>
          ) : (
            paginated.map((r) => (
              <div
                key={r._id || r.id || Math.random()}
                className="p-3"
                style={{ borderRadius: 8, border: "1px solid transparent" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: "var(--surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
                      {(r.user?.firstName || r.user?.name || r.author || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>
                        {r.user?.firstName ||
                          r.user?.name ||
                          r.author ||
                          "Anonymous"}
                      </div>
                      <div style={{ color: "#F6C34A" }}>
                        {Array(r.rating || 5)
                          .fill("★")
                          .join("")}
                      </div>
                    </div>
                    <p
                      className="text-sm mt-2"
                      style={{
                        color: "var(--text-secondary)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {r.comment || r.message || r.text}
                    </p>
                    <div
                      className="text-xs mt-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {new Date(
                        r.createdAt || r.date || Date.now()
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination controls */}
        {reviews.length > pageSize && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded"
              style={{
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text)",
              }}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className="px-3 py-1 rounded"
                style={{
                  border: "1px solid var(--border)",
                  background:
                    page === idx + 1
                      ? "var(--button-primary-bg)"
                      : "transparent",
                  color:
                    page === idx + 1
                      ? "var(--button-primary-text)"
                      : "var(--text)",
                }}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded"
              style={{
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text)",
              }}
            >
              {t("common.next", "Next")}
            </button>
          </div>
        )}

        {/* Review form: only show when allowed, user hasn't already reviewed, and not in read-only mode */}
        {canPost && !userReview && !readOnly && (
          <div className="mt-4">
            <h4 className="font-medium" style={{ color: "var(--text)" }}>
              {t("reviews.writeReview", "Write a review")}
            </h4>

            <div className="mt-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                disabled={submitting}
                className="w-full p-2 rounded disabled:opacity-50"
                style={{
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text)",
                }}
                placeholder={t("reviews.placeholder", "Write your review...")}
              />
              <div className="mt-3 flex items-center justify-between">
                <div style={{ display: "flex", gap: 6 }}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starIndex = isRtl ? 4 - i : i;
                    return (
                      <Star
                        key={i}
                        size={22}
                        filled={starIndex < rating}
                        onClick={() => !submitting && setRating(starIndex + 1)}
                        ariaLabel={`${t("reviews.setRating", "Set rating")} ${
                          starIndex + 1
                        }`}
                      />
                    );
                  })}
                </div>
                <button
                  onClick={submitReview}
                  disabled={submitting || !comment.trim()}
                  className="px-4 py-2 rounded btn-primary-hero disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: "none" }}
                >
                  {submitting
                    ? t("reviews.posting", "Posting...")
                    : t("reviews.post", "Post Review")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show message if user is not enrolled */}
        {!canPost && !userReview && !readOnly && user && (
          <div
            className="mt-4 p-3 rounded-lg"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {t(
                "reviews.enrollToReview",
                "You need an active enrollment to leave a review."
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
