import React from "react";
import {
  FaEye,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#1B1A17] text-[#E5E5E5] pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-linear-to-r from-[#C7A15C] to-[#E2C784] text-black p-2 rounded-full">
                <FaEye className="text-black text-2xl" />
              </div>
              <div className="text-xl font-semibold text-white">
                Mystic Egypt
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#E5E5E5]/90 mb-6">
              Your gateway to the wonders of Ancient Egypt. Experience history,
              culture, and adventure like never before.
            </p>

            <div className="flex gap-4 mt-4">
              <a className="w-11 h-11 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black text-xl hover:scale-110 transition">
                <FaFacebookF />
              </a>
              <a className="w-11 h-11 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black text-xl hover:scale-110 transition">
                <FaInstagram />
              </a>
              <a className="w-11 h-11 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black text-xl hover:scale-110 transition">
                <FaTwitter />
              </a>
              <a className="w-11 h-11 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black text-xl hover:scale-110 transition">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › About Us
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Our Tours
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Destinations
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Travel Blog
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › FAQs
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Contact Us
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-6">
              Popular Tours
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Pyramids of Giza
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Nile River Cruise
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Valley of the Kings
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Abu Simbel Temples
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Egyptian Museum
              </li>
              <li className="flex items-center gap-2 hover:text-[#D5B36A] transition">
                › Red Sea Diving
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-6">
              Contact Info
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#D5B36A] mt-1" />
                <p>123 Tahrir Square, Cairo, Egypt</p>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-[#D5B36A]" />
                <p>+20 2 1234 5678</p>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#D5B36A]" />
                <p>info@mysticegypt.com</p>
              </li>
              <li className="flex items-center gap-3">
                <FaClock className="text-[#D5B36A]" />
                <p>24/7 Support Available</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-6 text-center text-sm text-[#E5E5E5]/70">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6">
            <p>© 2024 Mystic Egypt Tours. All rights reserved.</p>

            <div className="flex gap-6 mt-4 md:mt-0">
              <a className="hover:text-[#D5B36A] transition">Privacy Policy</a>
              <a className="hover:text-[#D5B36A] transition">
                Terms of Service
              </a>
              <a className="hover:text-[#D5B36A] transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
