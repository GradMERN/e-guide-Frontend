import React from "react";
import { useAuth } from "../store/hooks";
import { useNavigate } from "react-router-dom";
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
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBecomeGuide = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "user") {
      navigate("/become-guide");
    }
  };

  // Show "Become a Guide" link only for non-guides or non-logged-in users
  const showBecomeGuide = !user || user.role === "user";

  return (
    <>
      <footer className="bg-surface dark:bg-surface text-text dark:text-text pt-16 pb-10 border-t border-gray-500/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-linear-to-r from-primary to-secondary text-black p-2 rounded-full">
                <FaEye className="text-black text-2xl" />
              </div>
              <div className="text-xl font-semibold text-primary dark:text-primary">
                Mystic Egypt Tours
              </div>
            </div>

            <p className="text-sm leading-relaxed text-text-secondary dark:text-text-secondary mb-6">
              Your gateway to the wonders of Ancient Egypt. Experience history,
              culture, and adventure like never before.
            </p>

            <div className="flex gap-4 mt-4">
              <a className="w-11 h-11 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center text-black text-xl hover:scale-110 transition hover:shadow-lg">
                <FaFacebookF />
              </a>
              <a className="w-11 h-11 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center text-black text-xl hover:scale-110 transition hover:shadow-lg">
                <FaInstagram />
              </a>
              <a className="w-11 h-11 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center text-black text-xl hover:scale-110 transition hover:shadow-lg">
                <FaTwitter />
              </a>
              <a className="w-11 h-11 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center text-black text-xl hover:scale-110 transition hover:shadow-lg">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-primary dark:text-primary mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › About Us
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Our Tours
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Destinations
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Travel Blog
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › FAQs
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Contact Us
              </li>
              {showBecomeGuide && (
                <li
                  className="flex items-center gap-2 hover:text-primary transition cursor-pointer text-primary font-semibold"
                  onClick={handleBecomeGuide}
                >
                  › {t("guide.becomeGuide", "Become a Guide")}
                </li>
              )}
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h3 className="text-xl font-semibold text-primary dark:text-primary mb-6">
              Popular Tours
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Pyramids of Giza
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Nile River Cruise
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Valley of the Kings
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Abu Simbel Temples
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Egyptian Museum
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
                › Red Sea Diving
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-primary dark:text-primary mb-6">
              Contact Info
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary dark:text-primary mt-1" />
                <p className="text-text-secondary dark:text-text-secondary">
                  123 Tahrir Square, Cairo, Egypt
                </p>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary dark:text-primary" />
                <p className="text-text-secondary dark:text-text-secondary">
                  +20 2 1234 5678
                </p>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary dark:text-primary" />
                <p className="text-text-secondary dark:text-text-secondary">
                  info@mysticegypttours.com
                </p>
              </li>
              <li className="flex items-center gap-3">
                <FaClock className="text-primary dark:text-primary" />
                <p className="text-text-secondary dark:text-text-secondary">
                  24/7 Support Available
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-500/10 mt-14 pt-6 text-center text-sm text-text-muted dark:text-text-muted">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6">
            <p>© 2025 Mystic Egypt Tours. All rights reserved.</p>

            <div className="flex gap-6 mt-4 md:mt-0">
              <a className="hover:text-primary transition cursor-pointer">
                Privacy Policy
              </a>
              <a className="hover:text-primary transition cursor-pointer">
                Terms of Service
              </a>
              <a className="hover:text-primary transition cursor-pointer">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
