import React, { useEffect, useState } from "react";
import enrollmentApi from "../../apis/enrollment.api";

const MyTours = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // refresh list
      fetchEnrollments();
    } catch (err) {
      alert(err.message || "Could not start enrollment");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Enrollments</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && enrollments.length === 0 && <div>No enrollments found.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enrollments.map((e) => (
          <div
            key={e._id}
            className="p-4 bg-surface rounded-xl border border-border"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-lg">{e.tour?.name}</h2>
                <p className="text-sm text-text-secondary">
                  {e.tour?.description?.slice(0, 120)}
                </p>
                <div className="text-sm text-text-secondary mt-2">
                  Status: <span className="font-medium">{e.status}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {e.tour?.price} {e.tour?.currency || "EGP"}
                </div>
                {e.status === "active" && (
                  <button
                    onClick={() => startEnrollment(e._id)}
                    className="mt-3 px-4 py-2 rounded-md bg-gradient-to-r from-primary to-secondary text-background font-semibold"
                  >
                    Start Tour
                  </button>
                )}
                {e.status === "started" && (
                  <div className="mt-3 text-sm text-green-600">In Progress</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTours;
