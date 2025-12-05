import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import userService from "../../apis/userService";
import { useAppDispatch } from "../../store/hooks";
import { loginSuccess, loginFailure } from "../../store/slices/authSlice";
import { useAuth } from "../../context/AuthContext";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("Signing you in...");

  const { updateUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("Missing token from Google callback.");
      navigate("/login?error=missing_token");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        // Persist token for axios interceptor
        localStorage.setItem("token", token);

        // Fetch profile via userService (axios client will use stored token)
        const res = await userService.getProfile();
        // backend returns { success, status, data }
        const user = res?.data ?? res;
        if (!mounted) return;

        // Persist user locally and update context
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {}

        // Update context so components using AuthContext reflect the login
        try {
          updateUser(user);
        } catch (e) {
          // ignore if context update not available
        }

        // Update redux
        dispatch(loginSuccess({ user, token }));

        // Redirect based on role or to home
        const role = (user?.role || "user").toLowerCase();
        if (role === "admin") navigate("/admin/dashboard", { replace: true });
        else if (role === "guide")
          navigate("/guide/dashboard", { replace: true });
        else navigate("/", { replace: true });
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setStatus("Failed to finalize Google sign-in.");
        dispatch(loginFailure(err.message || "OAuth failed"));
        navigate("/login?error=oauth_failed");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div
          className="animate-spin rounded-full"
          style={{
            width: 80,
            height: 80,
            borderWidth: 6,
            borderStyle: "solid",
            borderTopColor: "var(--color-primary)",
            borderRightColor: "transparent",
            borderBottomColor: "var(--color-secondary)",
            borderLeftColor: "transparent",
          }}
          aria-hidden="true"
        />

        <p className="mt-4 text-base" style={{ color: "var(--color-text)" }}>
          {status}
        </p>
      </div>
    </div>
  );
}
