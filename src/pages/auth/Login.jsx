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
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { login } from "../../apis/Auth/login.api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [animate, setAnimate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => setAnimate(true), []);
  const togglePassword = () => setShowPassword((s) => !s);

  const schema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const LeftCards = [
    {
      icon: GiEgyptianTemple,
      title: "Ancient Wonders",
      text: "Explore the magnificent pyramids, temples, and tombs that have stood for thousands of years.",
    },
    {
      icon: FaScroll,
      title: "Expert Guides",
      text: "Learn from Egyptologists who bring ancient history to life with captivating stories.",
    },
    {
      icon: FaShip,
      title: "Nile Cruises",
      text: "Sail the legendary Nile River in luxury while visiting historical sites along the way.",
    },
  ];

  const Stats = [
    { num: "5k+", label: "Travelers" },
    { num: "150+", label: "Packages" },
    { num: "25+", label: "Years Exp" },
  ];

  return (
    <>
      <Navbar />

      <section className="flex flex-row bg-[#050505] text-slate-200 overflow-hidden">
        {/* LEFT SECTION */}
        <div
          className={`hidden lg:flex w-1/2 flex-col items-center justify-center space-y-20 py-40 pt-30 px-20 transition-all duration-1000 ease-out ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
        >
          <div className="flex items-center gap-5">
            <GiEgyptianProfile className="max-[1212px]:w-20 max-[1212px]:h-20 w-24 h-24 text-[#f7c95f] drop-shadow-[0_0_15px_rgba(247,201,95,0.5)]" />
            <div className="flex flex-col text-center">
              <h1 className="bg-linear-to-r from-[#f7c95f] via-[#e9dcc0] to-[#f7c95f] bg-clip-text text-transparent max-[1212px]:text-3xl text-5xl font-extrabold tracking-tighter">
                MYSTIC EGYPT
              </h1>
              <p className="mt-2 pt-1 border-t border-[#f7c95f]/30 max-[1212px]:text-xs text-md uppercase tracking-widest text-[#bfb191]">
                Journey Through Millennia
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full max-w-lg space-y-8">
            {LeftCards.map((item, idx) => (
              <div
                key={idx}
                className="flex w-full gap-5 rounded-xl border border-[#f7c95f]/20 bg-[#171616]/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#f7c95f] hover:bg-[#1f1e1e] hover:shadow-[0_4px_20px_rgba(247,201,95,0.1)] hover:cursor-pointer"
              >
                <div className="rounded-lg bg-[#f7c95f]/10 p-3">
                  <item.icon size={28} className="text-[#f7c95f]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#bfb191]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-12">
            {Stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <h4 className="text-3xl font-bold text-[#f7c95f]">
                  {stat.num}
                </h4>
                <p className="text-xs uppercase tracking-wider text-[#bfb191]">
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
            <div className="absolute inset-0 bg-linear-to-b from-[#050505]/95 via-[#050505]/70 to-[#050505]" />
          </div>

          <div className="relative w-full max-w-sm sm:max-w-lg px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 md:py-15 rounded-2xl border border-[#f7c95f]/20 bg-[#0c0c0c]/80 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(247,201,95,0.2)] overflow-hidden">
            <div className="absolute top-0 h-1 w-full bg-linear-to-r from-transparent via-[#f7c95f] to-transparent opacity-50" />

            <div className="mb-15 flex flex-col items-center">
              <div className="mb-4 rounded-full border border-[#f7c95f]/40 bg-linear-to-br from-[#1a1a1a] to-[#0a0a0a] p-4 shadow-[0_0_20px_rgba(247,201,95,0.15)]">
                <GiEgyptianProfile className="h-8 w-8 sm:h-15 sm:w-15 text-[#f7c95f]" />
              </div>
              <h2 className="bg-linear-to-r from-[#f7c95f] via-[#e9dcc0] to-[#f7c95f] bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-center font-extrabold tracking-wide">
                Welcome Back
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
                  const res = await login(values);
                  const token = res.data.data?.token || res.data?.token;

                  if (!token) {
                    throw new Error("No token received from server");
                  }

                  const decodeJWT = (token) => {
                    try {
                      const base64Url = token.split(".")[1];
                      const base64 = base64Url
                        .replace(/-/g, "+")
                        .replace(/_/g, "/");
                      const jsonPayload = decodeURIComponent(
                        atob(base64)
                          .split("")
                          .map(
                            (c) =>
                              "%" +
                              ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                          )
                          .join("")
                      );
                      return JSON.parse(jsonPayload);
                    } catch (error) {
                      console.error("Failed to decode token:", error);
                      return null;
                    }
                  };

                  const decodedToken = decodeJWT(token);

                  if (!decodedToken) {
                    throw new Error("Failed to decode authentication token");
                  }

                  const user = {
                    id: decodedToken.id,
                    email: decodedToken.email,
                    name: decodedToken.name || values.email.split("@")[0],
                    role: decodedToken.role || "user",
                  };

                  console.log("Decoded user from token:", user);
                  console.log("Token:", token);

                  // Store token and user
                  localStorage.setItem("token", token);
                  localStorage.setItem("user", JSON.stringify(user));

                  // Update auth context
                  updateUser(user);

                  // Route based on user role
                  const role = user?.role?.toLowerCase();
                  console.log("User role:", user?.role, "Lowercased:", role);
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
                  alert(err.response?.data?.message || "Login failed");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                  <Field name="email">
                    {({ field, meta }) => (
                      <div className="flex flex-col">
                        <div className="relative flex items-center">
                          <MdEmail
                            className={`absolute left-4  transition-colors duration-300 ${focusedInput === "email"
                              ? "text-[#f7c95f]"
                              : "text-[#bfb191]"
                              }`}
                          />
                          <input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            onFocus={() => setFocusedInput("email")}
                            onBlur={(e) => {
                              field.onBlur(e);
                              setFocusedInput(null);
                            }}
                            className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3.5 ps-12 pr-4 text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50"
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
                              ? "text-[#f7c95f]"
                              : "text-[#bfb191]"
                              }`}
                          />
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            onFocus={() => setFocusedInput("password")}
                            onBlur={(e) => {
                              field.onBlur(e);
                              setFocusedInput(null);
                            }}
                            className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3.5 pl-12 pr-12 text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50"
                          />
                          <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bfb191] transition-colors hover:text-[#f7c95f]"
                          >
                            {showPassword ? <FaEyeSlash className="cursor-pointer" /> : <FaEye className="cursor-pointer" />}
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
                      className="text-xs text-[#bfb191] transition-colors hover:text-[#f7c95f]"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid || !dirty}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#c9a45f] to-[#aa853c] py-3.5 mt-7 font-bold text-black shadow-lg transition-all duration-300 hover:scale-[1.02] hover:to-[#c9a45f] active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <GiEgyptianProfile className="h-5 w-5 animate-spin text-black" />
                    ) : (
                      <>
                        {" "}
                        <FaSignInAlt /> <span>Sign In</span>{" "}
                      </>
                    )}
                  </button>

                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-[#2b2b2b]" />
                    <span className="text-xs uppercase text-gray-500">
                      Or continue with{" "}
                    </span>
                    <div className="flex-1 h-px bg-[#2b2b2b]" />
                  </div>

                  <button
                    onClick={() =>
                    (window.location.href =
                      "http://localhost:3000/api/auth/google")
                    }
                    type="button"
                    className="group flex w-full items-center justify-center gap-3 rounded-xl border border-[#2b2b2b] bg-[#1a1a1a] py-3 text-white cursor-pointer transition-all duration-300 hover:bg-[#252525] hover:border-[#f7c95f]/50"
                  >
                    <FaGoogle className="text-[#bfb191] transition-colors group-hover:text-white" />
                    <span className="text-sm font-medium text-[#bfb191] group-hover:text-white">
                      {" "}
                      Google Account{" "}
                    </span>
                  </button>
                </Form>
              )}
            </Formik>

            <Link
              to="/register"
              className="font-semibold text-[#f7c95f] transition-all hover:text-[#ffe4a0]"
            >
              <p className="mt-6 text-center text-sm text-gray-500 hover:text-[#f7c95f] cursor-pointer transition-all">
                New to Mystic Egypt? Create Account
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
