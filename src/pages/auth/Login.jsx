import { GiEgyptianTemple, GiEgyptianProfile } from "react-icons/gi";
import {
  FaShip,
  FaScroll,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaGoogle,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { login as loginApi } from "../../apis/Auth/login.api";
import { useDispatch } from "react-redux";
import { useAuth as useReduxAuth } from "../../store/hooks";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useReduxAuth();

  const [animate, setAnimate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { t } = useTranslation();

  useEffect(() => setAnimate(true), []);
  const togglePassword = () => setShowPassword((s) => !s);

  const schema = Yup.object({
    email: Yup.string().email(t("auth.login.errors.emailInvalid")).required(t("auth.login.errors.emailRequired")),
    password: Yup.string()
      .min(12, t("auth.login.errors.passwordMin"))
      .required(t("auth.login.errors.passwordRequired")),
  });

 const LeftCardsData = [
  { icon: GiEgyptianTemple, key: "ancientWonders" },
  { icon: FaScroll, key: "expertGuides" },
  { icon: FaShip, key: "nileCruises" },
];

const LeftCards = LeftCardsData.map(item => {
  const translations = t(`auth.leftCards.${item.key}`, { returnObjects: true });
  return { ...translations, icon: item.icon };
});
const Stats = t("auth.stats", { returnObjects: true });


  return (
    <>
      <Navbar />

      <section className="flex flex-row bg-background text-slate-200 overflow-hidden" dir="ltr">
        {/* LEFT SECTION */}
        <div
          className={`hidden lg:flex w-1/2 flex-col items-center justify-center space-y-20 py-40 pt-30 px-20 transition-all duration-1000 ease-out ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
        >
          <div className="flex items-center gap-5" >
            <GiEgyptianProfile className="max-[1212px]:w-20 max-[1212px]:h-20 w-24 h-24 text-primary drop-shadow-[0_0_15px_rgba(247,201,95,0.5)]" />
            <div className="flex flex-col text-center">
              <h1 className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent max-[1212px]:text-3xl text-5xl font-extrabold tracking-tighter">
                MYSTIC EGYPT
              </h1>
              <p className="mt-2 pt-1 border-t border-primary/30 max-[1212px]:text-xs text-md uppercase tracking-widest text-text-muted">
                {t("auth.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full max-w-lg space-y-8">
            {LeftCards.map((item, idx) => (
              <div
                key={idx}
                className="flex w-full gap-5 rounded-xl border border-primary/20 bg-surface/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-surface hover:shadow-[0_4px_20px_rgba(247,201,95,0.1)] hover:cursor-pointer"
              >
                <div className="rounded-lg bg-primary/10 p-3">
                  <item.icon size={28} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-muted">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-12">
            {Stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <h4 className="text-3xl font-bold text-primary">
                  {stat.num}
                </h4>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          className={`w-full lg:w-1/2 flex items-center justify-center bg-[#130f0c] py-40 pt-50 px-3 lg:px-10 transition-all duration-1000 ease-out delay-100 ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
        >
          <div className="absolute inset-0">
            <img
              src="src/assets/images/loginBg.webp"
              className="h-full w-full object-cover opacity-30"
              alt="bg-login"
            />
            <div className="auth-login-overlay " />
          </div>

          <div className="relative w-full max-w-sm sm:max-w-lg px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 md:py-15 rounded-2xl border border-border bg-register-form backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(247,201,95,0.2)] overflow-hidden">
            <div className="absolute top-0 h-1 w-full bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="mb-15 flex flex-col items-center">
              <div className="mb-4 rounded-full border border-primary/40 bg-background p-4 shadow-[0_0_20px_rgba(247,201,95,0.15)]">
                <GiEgyptianProfile className="h-8 w-8 sm:h-15 sm:w-15 text-primary" />
              </div>
              <h2 className="text-gradient-title bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-center font-extrabold tracking-wide">
                {t("auth.login.welcome")}
              </h2>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={schema}
              validateOnBlur
              validateOnChange
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);
                  const res = await loginApi(values);
                  const token = res.data.data?.token || res.data?.token;

                  if (!token) {
                    throw new Error("No token received from server");
                  }

                  // const decodeJWT = (token) => {
                  //   try {
                  //     const base64Url = token.split(".")[1];
                  //     const base64 = base64Url
                  //       .replace(/-/g, "+")
                  //       .replace(/_/g, "/");
                  //     const jsonPayload = decodeURIComponent(
                  //       atob(base64)
                  //         .split("")
                  //         .map(
                  //           (c) =>
                  //             "%" +
                  //             ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                  //         )
                  //         .join("")
                  //     );
                  //     return JSON.parse(jsonPayload);
                  //   } catch (error) {
                  //     console.error("Failed to decode token:", error);
                  //     return null;
                  //   }
                  // };

                  // const decodedToken = decodeJWT(token);

                  // if (!decodedToken) {
                  //   throw new Error("Failed to decode authentication token");
                  // }

                  // // Extract user data from token
                  // const user = {
                  //   id: decodedToken.id,
                  //   email: decodedToken.email,
                  //   firstName: decodedToken.firstName || decodedToken.name?.split(' ')[0] || "User",
                  //   lastName: decodedToken.lastName || decodedToken.name?.split(' ').slice(1).join(' ') || "",
                  //   // name: decodedToken.name || `${decodedToken.firstName || ""} ${decodedToken.lastName || ""}`.trim(),
                  //   role: decodedToken.role || "user",
                  // };

                  // console.log("Decoded user from token:", user);
                  // console.log("Token:", token);

                  // Use redux login helper which persists token/user and updates state
                  login(res.data.data, token);

                  // Route based on user role
                  const role = res.data.data?.role?.toLowerCase();
                  console.log(
                    "User role:",
                    res.data.data?.role,
                    "Lowercased:",
                    role
                  );
                  if (role === "admin") {
                    console.log("Routing to /admin/dashboard");
                    navigate("/admin/dashboard");
                  } else if (role === "guide") {
                    console.log("Routing to /guide/dashboard");
                    navigate("/guide/dashboard");
                  } else {
                    console.log("Routing to /");
                    navigate("/");
                  }
                } catch (err) {
                  console.error("Login error:", err);
                  toast.error(err.response?.data?.message || "Login failed");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                  <Field name="email" >
                    {({ field, meta }) => (
                      <div className="flex flex-col">
                        <div className="relative flex items-center">
                          <MdEmail
                            className={`absolute left-4  transition-colors duration-300 ${focusedInput === "email"
                              ? "text-primary"
                              : "text-text-muted"
                              }`}
                          />
                          <input
                            {...field}
                            type="email"
                            placeholder={t("auth.login.emailPlaceholder")}
                            onFocus={() => setFocusedInput("email")}
                            onBlur={(e) => {
                              field.onBlur(e);
                              setFocusedInput(null);
                            }}
                            className="w-full rounded-xl input-register-border bg-background py-3.5 ps-12 pr-4 text-text placeholder-text-muted outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary/50"
                          />
                        </div>
                        {meta.touched && meta.error && (
                          <p className="text-red-500 text-sm mt-2 ms-2">
                            {meta.error}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>

                  <Field name="password">
                    {({ field, meta }) => (
                      <div className="flex flex-col">
                        <div className="relative flex items-center">
                          <FaLock
                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === "password"
                              ? "text-primary"
                              : "text-text-muted"
                              }`}
                          />
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.login.passwordPlaceholder")}
                            onFocus={() => setFocusedInput("password")}
                            onBlur={(e) => {
                              field.onBlur(e);
                              setFocusedInput(null);
                            }}
                            className="w-full rounded-xl input-register-border bg-background py-3.5 pl-12 pr-12 text-text placeholder-text-muted outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary/50"
                          />
                          <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-primary"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="cursor-pointer" />
                            ) : (
                              <FaEye className="cursor-pointer" />
                            )}
                          </button>
                        </div>
                        {meta.touched && meta.error && (
                          <p className="text-red-500 text-sm mt-2 ms-2">
                            {meta.error}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>

                  <div className="flex justify-end -mt-3 sm:-mt-4.5 md:-mt-5">
                    <Link
                      to="#"
                      className="text-xs text-text-muted transition-colors hover:text-primary"
                    >
                      {t("auth.login.forgot")}
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid || !dirty}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-xl btn-primary-hero py-3.5 mt-7 font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:to-[#c9a45f] active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <GiEgyptianProfile className="h-5 w-5 animate-spin text-black" />
                    ) : (
                      <>
                        {" "}
                        <FaSignInAlt /> <span>{t("auth.login.signIn")}</span>{" "}
                      </>
                    )}
                  </button>

                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs uppercase text-text-muted">
                      {t("auth.login.or")}{" "}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <button
                    onClick={() =>
                    (window.location.href =
                      "http://localhost:3000/api/auth/google")
                    }
                    type="button"
                    className="group flex w-full items-center justify-center gap-3 rounded-xl py-3  cursor-pointer transition-all duration-300 btn-secondary-hero"
                  >
                    <FaGoogle className="text-text-muted transition-colors group-hover:text-current" />
                    <span className="text-sm font-medium text-text-muted group-hover:text-current">
                      {" "}
                      {t("auth.login.google")}{" "}
                    </span>
                  </button>
                </Form>
              )}
            </Formik>

            <Link
              to="/register"
              className="font-semibold text-text-muted transition-all hover:text-primary"
            >
              <p className="mt-6 text-center text-sm text-text-muted hover:text-primary cursor-pointer transition-all">
                {t("auth.login.noAccount")}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
