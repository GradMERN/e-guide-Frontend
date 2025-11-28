import { useState, useEffect, useRef } from "react";
import { IoPerson } from "react-icons/io5";
import { MdEmail, MdLocationCity } from "react-icons/md";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaLock, FaEye, FaEyeSlash, FaPhoneAlt } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { GiEgyptianProfile } from "react-icons/gi";
import { Link } from "react-router-dom";

const countries = ["Egypt", "USA"];
const cities = ["Cairo", "Alexandria"];

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [fileName, setFileName] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [animate, setAnimate] = useState(false);


  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");


  const countryRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(() => setAnimate(true), []);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextStep = () => { if (step < 3) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  };

  return (
    <section className="relative min-h-screen flex justify-center items-center bg-black overflow-hidden px-4 sm:px-6 lg:px-8 py-25">
      <div className="absolute inset-0">
        <img src="src/assets/images/loginBg.webp" className="h-full w-full object-cover opacity-30" alt="bg-register" />
        <div className="absolute inset-0 bg-linear-to-b from-[#050505]/95 via-[#050505]/70 to-[#050505]" />
      </div>

      <div className={`relative w-full max-w-md sm:max-w-lg lg:max-w-xl px-6 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12 rounded-2xl border border-[#f7c95f]/20 bg-[#0c0c0c] backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(247,201,95,0.2)] overflow-hidden transition-all duration-1000 ease-out
        ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>

        <div className="absolute top-0 h-1 w-full bg-linear-to-r from-transparent via-[#f7c95f] to-transparent opacity-50" />

        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="mb-4 rounded-full border border-[#f7c95f]/40 bg-linear-to-br from-[#1a1a1a] to-[#0a0a0a] p-4 shadow-[0_0_20px_rgba(247,201,95,0.15)]">
            <GiEgyptianProfile className="h-8 w-8 sm:h-12 sm:w-12 text-[#f7c95f]" />
          </div>
          <h2 className="bg-linear-to-r from-[#f7c95f] via-[#e9dcc0] to-[#f7c95f] bg-clip-text text-transparent text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-extrabold tracking-wide">
            Create Your Account
          </h2>
        </div>

        <div className="relative flex items-center justify-between mb-8">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 -z-10 rounded"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-[#f7c95f] -z-10 rounded transition-all duration-500" style={{ width: step === 1 ? "30%" : step === 2 ? "60%" : "100%" }}></div>

          <div className={`w-4 h-4 flex items-center justify-center rounded-full font-bold text-[10px] transition-all duration-500 ${step >= 1 ? "bg-[#f7c95f] text-black scale-110 shadow-lg" : "bg-gray-600 text-white"}`}>1</div>
          <div className={`w-4 h-4 flex items-center justify-center rounded-full font-bold text-[10px] transition-all duration-500 ${step >= 2 ? "bg-[#f7c95f] text-black scale-110 shadow-lg" : "bg-gray-600 text-white"}`}>2</div>
          <div className={`w-4 h-4 flex items-center justify-center rounded-full font-bold text-[10px] transition-all duration-500 ${step >= 3 ? "bg-[#f7c95f] text-black scale-110 shadow-lg" : "bg-gray-600 text-white"}`}>3</div>
        </div>

        <form className="flex flex-col gap-4 sm:gap-5 md:gap-6">
          {step === 1 && (
            <>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <IoPerson className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === "fullname" ? "text-[#f7c95f]" : "text-[#bfb191]"}`} />
                  <input type="text" placeholder="Full Name" onFocus={() => setFocusedInput("fullname")} onBlur={() => setFocusedInput(null)}
                    className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50" />
                </div>

                <div className="relative">
                  <MdEmail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === "email" ? "text-[#f7c95f]" : "text-[#bfb191]"}`} />
                  <input type="email" placeholder="Email Address" onFocus={() => setFocusedInput("email")} onBlur={() => setFocusedInput(null)}
                    className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50" />
                </div>
              </div>
              <button type="button" onClick={nextStep} className="w-full py-3 mt-2 bg-linear-to-r from-[#c9a45f] to-[#aa853c] rounded-xl text-black font-semibold   transition-transform duration-300 ease-out transform hover:-translate-y-1  cursor-pointer">Next</button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === "password" ? "text-[#f7c95f]" : "text-[#bfb191]"}`} />
                  <input type={showPwd1 ? "text" : "password"} placeholder="Password" onFocus={() => setFocusedInput("password")} onBlur={() => setFocusedInput(null)}
                    className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-12 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50" />
                  <button type="button" onClick={() => setShowPwd1(!showPwd1)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f7c95f] transition-colors">
                    {showPwd1 ? <FaEyeSlash className="cursor-pointer" /> : <FaEye className="cursor-pointer" />}
                  </button>
                </div>
                <div className="relative">
                  <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === "confirm" ? "text-[#f7c95f]" : "text-[#bfb191]"}`} />
                  <input type={showPwd2 ? "text" : "password"} placeholder="Confirm Password" onFocus={() => setFocusedInput("confirm")} onBlur={() => setFocusedInput(null)}
                    className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-12 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50" />
                  <button type="button" onClick={() => setShowPwd2(!showPwd2)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f7c95f] transition-colors">
                    {showPwd2 ? <FaEyeSlash className="cursor-pointer" /> : <FaEye className="cursor-pointer" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button type="button" onClick={prevStep} className="w-1/2 py-3 border border-[#f7c95f] rounded-xl text-[#f7c95f] transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:bg-[#1a1a1a] cursor-pointer">Back</button>
                <button type="button" onClick={nextStep} className="w-1/2 py-3 bg-linear-to-r from-[#c9a45f] to-[#aa853c] rounded-xl text-black font-semibold   transition-transform duration-300 ease-out transform hover:-translate-y-1  cursor-pointer">Next</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                <div className="relative" ref={countryRef}>
                  <AiOutlineGlobal className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === "country" ? "text-[#f7c95f]" : "text-[#bfb191]"}`} />
                  <div onClick={() => setCountryOpen(!countryOpen)} className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white cursor-pointer flex justify-between items-center transition-all duration-300">
                    {selectedCountry || "Select Country"} <span>▼</span>
                  </div>
                  {countryOpen && (
                    <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-[#2b2b2b] rounded-xl mt-1 shadow-lg z-50">
                      {countries.map((country, idx) => (
                        <div key={country} onClick={() => { setSelectedCountry(country); setCountryOpen(false); }}
                          className={`px-4 py-2 cursor-pointer hover:bg-[#aa853c] text-white transition-colors ${idx !== countries.length - 1 ? "border-b border-gray-700" : ""}`}>
                          {country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                <div className="relative" ref={cityRef}>
                  <MdLocationCity className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === "city" ? "text-[#f7c95f]" : "text-[#bfb191]"}`} />
                  <div onClick={() => setCityOpen(!cityOpen)} className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white cursor-pointer flex justify-between items-center transition-all duration-300">
                    {selectedCity || "Select City"} <span>▼</span>
                  </div>
                  {cityOpen && (
                    <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-[#2b2b2b] rounded-xl mt-1 shadow-lg z-50">
                      {cities.map((city, idx) => (
                        <div key={city} onClick={() => { setSelectedCity(city); setCityOpen(false); }}
                          className={`px-4 py-2 cursor-pointer hover:bg-[#aa853c] text-white transition-colors ${idx !== cities.length - 1 ? "border-b border-gray-700" : ""}`}>
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative mt-4">
                <FaPhoneAlt className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === "phone" ? "text-[#f7c95f]" : "text-[#bfb191]"}`} />
                <input type="text" placeholder="Phone" onFocus={() => setFocusedInput("phone")} onBlur={() => setFocusedInput(null)} className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50" />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <label htmlFor="file" className="flex items-center justify-center rounded-full p-2 border border-[#f7c95f] w-10 h-10 cursor-pointer hover:bg-[#d4af37] group  transition-colors">
                  <FiUpload className="text-[#f7c95f] group-hover:text-[#1a1a1a]  text-lg" />
                </label>
                <div className="flex flex-col text-xs">
                  <label htmlFor="file" className="cursor-pointer text-[#f7c95f]">{fileName || "Upload Profile Picture"}</label>
                  <span className="text-gray-400 text-xs">JPG, PNG (max 2MB)</span>
                </div>
                <input type="file" id="file" className="hidden" onChange={onFileChange} accept="image/png, image/jpeg" />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 py-3 border border-[#f7c95f] rounded-xl text-[#f7c95f] transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:bg-[#1a1a1a] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-linear-to-r from-[#c9a45f] to-[#aa853c] rounded-xl text-black font-semibold
     transition-transform duration-300 ease-out transform hover:-translate-y-1  cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </>
          )}

        </form>
        <Link to="/login" className="font-semibold">
          <p className="mt-6 text-center text-sm text-gray-500 hover:text-[#f7c95f] cursor-pointer transition-all">Already have an account?{" "} Sign In </p>
        </Link>

      </div>
    </section>
  );
}
