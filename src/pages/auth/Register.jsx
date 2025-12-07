import { useState, useEffect, useRef } from "react";
import { IoPerson } from "react-icons/io5";
import { MdEmail, MdLocationCity } from "react-icons/md";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaLock, FaEye, FaEyeSlash, FaPhoneAlt } from "react-icons/fa";
import { GiEgyptianProfile } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { register } from "../../apis/Auth/register.api";
import { toast } from "react-toastify";

const countries = [
  "Egypt",
  "USA",
  "Canada",
  "UK",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Australia",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Mexico",
  "South Africa",
  "Russia",
  "Turkey",
  "Netherlands",
  "Sweden",
  "Norway",
];

const cities = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Luxor",
  "Aswan",
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Toronto",
  "Vancouver",
  "London",
  "Manchester",
  "Berlin",
  "Munich",
  "Paris",
  "Marseille",
  "Rome",
  "Milan",
  "Madrid",
  "Barcelona",
  "Sydney",
  "Melbourne",
  "Tokyo",
  "Osaka",
  "Beijing",
  "Shanghai",
  "Mumbai",
  "Delhi",
  "Rio de Janeiro",
  "Sao Paulo",
  "Mexico City",
  "Cape Town",
  "Johannesburg",
  "Moscow",
  "Istanbul",
  "Amsterdam",
  "Stockholm",
  "Oslo",
];

const InputField = ({
  icon: Icon,
  placeholder,
  type = "text",
  focusedInput,
  setFocusedInput,
  extraClass = "",
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col w-full">
      <div className="relative flex items-center">
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === placeholder ? "text-primary" : "text-text-muted"}`} />
        <input {...field} {...props} type={type} placeholder={placeholder}
          onFocus={() => setFocusedInput(placeholder)} onBlur={(e) => { field.onBlur(e); setFocusedInput(null); }}
          className={`w-full rounded-xl  input-register-border bg-background py-3 pl-12 pr-4 text-text placeholder-text-muted outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary/50 ${extraClass}`} />
      </div>
      {meta.touched && meta.error && (
        <p className="text-red-500 text-xs mt-1 ms-2">{meta.error}</p>
      )}
    </div>
  );
};

const PasswordField = ({
  placeholder,
  show,
  setShow,
  focusedInput,
  setFocusedInput,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col w-full">
      <div className="relative flex items-center">
        <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 ${focusedInput === placeholder ? "text-primary" : "text-text-muted"}`} />
        <input {...field} {...props} type={show ? "text" : "password"} placeholder={placeholder}
          onFocus={() => setFocusedInput(placeholder)} onBlur={(e) => { field.onBlur(e); setFocusedInput(null); }}
          className="w-full rounded-xl input-register-border bg-background py-3 pl-12 pr-12 text-text placeholder-text-muted outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary/50" />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {meta.touched && meta.error && (
        <p className="text-red-500 text-xs mt-1 ms-2">{meta.error}</p>
      )}
    </div>
  );
};

const DropdownField = ({
  icon: Icon,
  options,
  placeholder,
  focusedInput,
  setFocusedInput,
  open,
  setOpen,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  return (
    <div className="flex flex-col w-full">
      <div className="relative flex items-center" onClick={() => setOpen(!open)}>
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedInput === placeholder ? "text-primary" : "text-text-muted"}`} />

        <div className={`w-full rounded-xl  input-register-border bg-background py-3 pl-12 pr-10 text-text cursor-pointer flex items-center transition-all duration-300`}>
          <span className={`truncate ${!field.value && "text-text-muted"}`}>
            {field.value || `Select ${placeholder}`}
          </span>
          <span className="ml-auto text-text-muted">▼</span>
        </div>

        {open && (
          <div className="absolute top-full left-0 w-full bg-surface  input-register-border rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto z-50 scrollbar-none">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={(e) => {
                  e.stopPropagation();
                  helpers.setValue(opt);
                  helpers.setTouched(true);
                  setOpen(false);
                }}
                className="px-4 py-2 cursor-pointer text-text hover:bg-primary hover:text-white transition">
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
      {meta.touched && meta.error && (
        <p className="text-red-500 text-xs mt-1 ms-2">{meta.error}</p>
      )}
    </div>
  );
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => setAnimate(true), []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target))
        setCountryOpen(false);
      if (cityRef.current && !cityRef.current.contains(e.target))
        setCityOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPhoneNumber = (input) => {
    let cleaned = input.replace(/\D/g, "");
    if (cleaned.startsWith("20")) cleaned = cleaned.slice(1);
    if (!cleaned.startsWith("0")) cleaned = "0" + cleaned;
    return cleaned;
  };

  const validationSchema = [
    Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      age: Yup.number()
        .min(13, "Must be at least 13")
        .max(100, "Invalid age")
        .required("Age is required"),
    }),

    Yup.object({
      password: Yup.string()
        .min(12, "Must be at least 12 characters")
        .matches(/(?=(.*[A-Z]){2})/, "Must contain 2 uppercase letters")
        .matches(/(?=(.*[a-z]){2})/, "Must contain 2 lowercase letters")
        .matches(/(?=(.*\d){2})/, "Must contain 2 numbers")
        .matches(
          /(?=(.*[!@#$%^&*()\-__+.]){2})/,
          "Must contain 2 special characters"
        )
        .test(
          "no-repeats",
          "No more than 2 identical characters allowed",
          (val) => !/(.)\1\1/.test(val || "")
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),

    Yup.object({
      country: Yup.string().required("Country is required"),
      city: Yup.string().required("City is required"),
      phone: Yup.string()
        .test("is-egyptian", "Invalid phone number", (val) => {
          if (!val) return false;
          const cleaned = formatPhoneNumber(val);
          return /^01[0125][0-9]{8}$/.test(cleaned);
        })
        .required("Phone is required"),
    }),
  ];

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    phone: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const cleanPhone = String(values.phone).trim();

      const body = {
        firstName: values.firstname,
        lastName: values.lastname,
        age: values.age,
        phone: cleanPhone,
        country: values.country,
        city: values.city,
        email: values.email,
        password: values.password,
      };

      console.log("SENDING:", body);

      const res = await register(body);
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Registration failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex justify-center items-center bg-background overflow-hidden px-4 sm:px-6 lg:px-8 py-25">

      <div className="absolute inset-0">
        <img src="src/assets/images/loginBg.webp" className="h-full w-full object-cover opacity-30" alt="bg-register" />
        <div className="absolute inset-0 auth-register-overlay" />
      </div>

      <div className={`relative w-full max-w-md sm:max-w-lg lg:max-w-xl px-6 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12 rounded-2xl border border-border bg-register-form backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(247,201,95,0.2)] overflow-hidden transition-all duration-1000 ease-out ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
        <div className="absolute top-0 h-1 w-full bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />

        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="mb-4 rounded-full border border-primary/40 bg-background p-4 shadow-[0_0_20px_rgba(247,201,95,0.15)]">
            <GiEgyptianProfile className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
          </div>
          <h2 className="text-gradient-title bg-clip-text text-transparent text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-extrabold tracking-wide">
            Create Your Account
          </h2>
        </div>

        <div className="relative flex items-center justify-between mb-8">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-text-muted/30 -z-10 rounded"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-primary-z-10 rounded transition-all duration-500" style={{ width: step === 1 ? "30%" : step === 2 ? "60%" : "100%" }}></div>
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-4 h-4 flex items-center justify-center rounded-full font-bold text-[10px] transition-all duration-500 ${step >= s ? "bg-primary text-button-text scale-110 shadow-lg" : "bg-surface border border-text-muted text-text-muted"}`}>{s}</div>
          ))}
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema[step - 1]}
          onSubmit={(values, actions) => {
            if (step < 3) {
              setStep(step + 1);
              actions.setTouched({});
              actions.setSubmitting(false);
            } else {
              handleSubmit(values, actions);
            }
          }}
        >
          {({ isSubmitting, isValid, errors }) => (
            <Form className="flex flex-col gap-4 sm:gap-5 md:gap-6">
              {step === 1 && (
                <>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <InputField
                        name="firstname"
                        icon={IoPerson}
                        placeholder="firstname"
                        focusedInput={focusedInput}
                        setFocusedInput={setFocusedInput}
                      />
                      <InputField
                        name="lastname"
                        icon={IoPerson}
                        placeholder="lastname"
                        focusedInput={focusedInput}
                        setFocusedInput={setFocusedInput}
                      />
                    </div>
                    <InputField
                      name="email"
                      icon={MdEmail}
                      placeholder="email"
                      type="email"
                      focusedInput={focusedInput}
                      setFocusedInput={setFocusedInput}
                    />
                    <InputField
                      name="age"
                      icon={IoPerson}
                      placeholder="age"
                      type="number"
                      focusedInput={focusedInput}
                      setFocusedInput={setFocusedInput}
                    />
                  </div>
                  <button type="submit" className="w-full py-3 mt-2 btn-primary-hero rounded-xl font-semibold transition-transform duration-300 ease-out transform hover:-translate-y-1 cursor-pointer">
                    Next
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex flex-col gap-4">
                    <PasswordField
                      name="password"
                      placeholder="password"
                      show={showPwd1}
                      setShow={setShowPwd1}
                      focusedInput={focusedInput}
                      setFocusedInput={setFocusedInput}
                    />
                    <PasswordField
                      name="confirmPassword"
                      placeholder="confirm password"
                      show={showPwd2}
                      setShow={setShowPwd2}
                      focusedInput={focusedInput}
                      setFocusedInput={setFocusedInput}
                    />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/2 py-3 rounded-xl transition-transform duration-300 ease-out transform hover:-translate-y-1 btn-secondary-hero cursor-pointer">Back</button>
                    <button type="submit" className="w-1/2 py-3 btn-primary-hero rounded-xl font-semibold transition-transform duration-300 ease-out transform hover:-translate-y-1 cursor-pointer">Next</button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div ref={countryRef}>
                      <DropdownField
                        name="country"
                        icon={AiOutlineGlobal}
                        options={countries}
                        open={countryOpen}
                        setOpen={setCountryOpen}
                        placeholder="country"
                        focusedInput={focusedInput}
                        setFocusedInput={setFocusedInput}
                      />
                    </div>
                    <div ref={cityRef}>
                      <DropdownField
                        name="city"
                        icon={MdLocationCity}
                        options={cities}
                        open={cityOpen}
                        setOpen={setCityOpen}
                        placeholder="city"
                        focusedInput={focusedInput}
                        setFocusedInput={setFocusedInput}
                      />
                    </div>
                  </div>
                  <InputField
                    name="phone"
                    icon={FaPhoneAlt}
                    placeholder="phone"
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />

                  <div className="flex gap-4 mt-4">
                    <button type="button" onClick={() => setStep(2)} className="w-1/2 py-3 btn-secondary-hero rounded-xl  transition-transform duration-300 ease-out transform hover:-translate-y-1 cursor-pointer">Back</button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className={`w-1/2 py-3 rounded-xl font-semibold transition-all duration-300 ease-out transform 
                        ${
                          isSubmitting || !isValid
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-70"
                            : "bg-linear-to-r from-[#c9a45f] to-[#aa853c] text-black hover:-translate-y-1 cursor-pointer"
                        }`}
                    >
                      {isSubmitting ? "Loading..." : "Register"}
                    </button>
                  </div>
                </>
              )}
            </Form>
          )}
        </Formik>

        <p className="text-text-muted text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
