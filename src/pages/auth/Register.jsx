import { MdEmail } from "react-icons/md";
import { FaLock, FaEye, FaSignInAlt, FaCity, FaPhoneAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { AiOutlineGlobal } from "react-icons/ai";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { FiUpload } from "react-icons/fi";
import { useState } from "react";

export default function Register() {
  const GOLD = "#cfa548";

  const [step, setStep] = useState(1);
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [fileName, setFileName] = useState("");

  const progress = Math.floor((step / 3) * 100);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  };

  return (
    <section
      className="relative min-h-screen flex justify-center items-center bg-cover bg-center "
      style={{
        backgroundImage:
          "url('./src/assets/images/register.jpg')",
      }}
    >

      <div className="absolute inset-0 bg-[#2b1d12]/65 backdrop-blur-xs"></div>
      ``
      {/* Form container */}
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl border-t-4 border-[#cfa548] bg-[#2b1d12]/40 backdrop-blur-2xl ">
        {/* Header */}
        <div className="flex flex-col items-center pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#cfa548]">
            CREATE YOUR ACCOUNT
          </h2>
          <p className="text-sm sm:text-base text-gray-200 italic text-center mt-1">
            Join thousands of explorers discovering Egypt
          </p>
        </div>


        <div className="my-8 mb-10">
          <div className="flex justify-between text-xs sm:text-sm font-semibold text-gray-200 mb-1">
            <span className="text-[#cfa548]">Step {step} of 3</span>
            <span className="text-[#cfa548]">{progress}%</span>
          </div>
          <div className="w-full bg-gray-400 rounded-full h-2 sm:h-3 overflow-hidden">
            <div
              className="h-2 sm:h-3 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%`, backgroundColor: GOLD }}
            />
          </div>
        </div>

        <form className=" pb-5">
          {step === 1 && (
            <div className="space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#cfa548]">
                    <IoPerson className="text-[#cfa548]" /> First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First name"
                    className="mt-2 w-full px-3 py-2 text-sm bg-[#faf7f0] rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#cfa548]/20 transition-shadow"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium  text-[#cfa548]">
                    <IoPerson className="text-[#cfa548]" /> Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last name"
                    className="mt-2 w-full px-3 py-2 text-sm bg-[#faf7f0] rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#cfa548]/20 transition-shadow"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#cfa548]">
                  <HiMiniCalendarDateRange className="text-[#cfa548]" /> Age
                </label>
                <input
                  type="number"
                  placeholder="Your age"
                  min="0"
                  className="mt-2 w-full px-3 py-2 text-sm bg-[#faf7f0] rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#cfa548]/20 transition-shadow"
                />
              </div>

              {/* Upload */}
              <div>


                <div className="flex items-center gap-3 mt-1">
                  <label
                    htmlFor="myfile"
                    className="flex items-center justify-center rounded-full p-2 bg-[#cfa548] w-10 h-10 cursor-pointer hover:bg-[#b99239] transition-colors"
                  >
                    <FiUpload className="text-white text-lg" />
                  </label>
                  <div className="flex flex-col text-xs">
                    <label
                      htmlFor="myfile"
                      className="cursor-pointer text-sm text-[#cfa548]"
                    >
                      {fileName || "Click to upload profile picture"}
                    </label>
                    <span className="text-gray-400 text-xs">
                      JPG, PNG, GIF (max 2MB)
                    </span>
                  </div>
                  <input
                    type="file"
                    id="myfile"
                    className="hidden"
                    onChange={onFileChange}
                    accept="image/png, image/jpeg, image/gif"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full py-3 text-sm font-semibold rounded-lg
                 bg-linear-to-r from-[#d4af37] to-[#ca8a04] hover:bg-linear-to-r hover:from-[#ca8a04] hover:to-[#d4af37] text-white transition-colors mt-4 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <AiOutlineGlobal className="text-[#cfa548]" /> Country
                </label>
                <select className="mt-2 w-full px-3 py-2 text-sm bg-[#faf7f0] rounded-lg border border-gray-300  transition-colors cursor-pointer">
                  <option value="" className="hover:bg-[#cfa548]">Select Country</option>
                  <option value="Egypt">Egypt</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="France">France</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <FaCity className="text-[#cfa548]" /> City
                </label>
                <select className="mt-2 w-full px-3 py-2 text-sm bg-[#faf7f0] rounded-lg border border-gray-300 transition-colors cursor-pointer">
                  <option value="">Select City</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Giza">Giza</option>
                  <option value="Luxor">Luxor</option>
                </select>
              </div>

              <div className="flex gap-3 mt-10">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 py-3 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700
                   hover:bg-[#d4af37] hover:border-[#cfa548] transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-1/2 py-3 text-sm font-semibold rounded-lg 
                   bg-linear-to-r from-[#d4af37] to-[#ca8a04] hover:bg-linear-to-r hover:from-[#ca8a04] hover:to-[#d4af37] text-white transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-7">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <MdEmail className="text-[#cfa548]" /> Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="mt-1 w-full px-3 py-2 text-sm bg-[#faf7f0] rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cfa548]/20 transition-shadow"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <FaPhoneAlt className="text-[#cfa548]" /> Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 555 123 4567"
                  className="mt-1 w-full px-3 py-2 text-sm bg-[#faf7f0] rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cfa548]/20 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    <FaLock className="text-[#cfa548]" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd1 ? "text" : "password"}
                      placeholder="Enter password"
                      className="mt-1 w-full px-3 py-2 text-sm bg-[#faf7f0] rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cfa548]/20 transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd1(!showPwd1)}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${showPwd1 ? "text-[#b99239]" : "text-gray-500"}`}
                      aria-label="Toggle password visibility"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    <FaLock className="text-[#cfa548]" /> Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd2 ? "text" : "password"}
                      placeholder="Re-enter password"
                      className="mt-1 w-full px-3 py-2 text-sm bg-[#faf7f0] rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cfa548]/20 transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd2(!showPwd2)}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${showPwd2 ? "text-[#b99239]" : "text-gray-500"}`}
                      aria-label="Toggle password visibility"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-10 ">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full py-3 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-[#d4af37]  hover:border-[#cfa548] transition-all cursor-pointer text-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className=" mt-5 w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2  text-white transition-colors cursor-pointer  bg-linear-to-r from-[#d4af37] to-[#ca8a04] hover:bg-linear-to-r hover:from-[#ca8a04] hover:to-[#d4af37]"
                >
                  <FaSignInAlt /> Create Account
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
