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

  const showBecomeGuide = !user || user.role === "user";

  return (
    <footer className="bg-surface text-text pt-16 pb-10 border-t border-gray-500/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-linear-to-r from-primary to-secondary p-2 rounded-full">
              <FaEye className="text-black text-2xl" />
            </div>
            <div className="text-xl font-semibold text-primary">
              {t("footer.company.name")}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-text-secondary mb-6">
            {t("footer.company.description")}
          </p>

          <div className="flex gap-4 mt-4">
            {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
              (Icon, index) => (
                <a
                  key={index}
                  className="w-11 h-11 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center text-black text-xl hover:scale-110 transition hover:shadow-lg"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-primary mb-6">
            {t("footer.quickLinks.title")}
          </h3>
          <ul className="space-y-3 text-sm">
            {t("footer.quickLinks.links", { returnObjects: true }).map(
              (item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 hover:text-primary transition cursor-pointer"
                >
                  › {item}
                </li>
              )
            )}

            {showBecomeGuide && (
              <li
                className="flex items-center gap-2 hover:text-primary transition cursor-pointer text-primary font-semibold"
                onClick={handleBecomeGuide}
              >
                › {t("footer.becomeGuide")}
              </li>
            )}
          </ul>
        </div>

        {/* Popular Tours */}
        <div>
          <h3 className="text-xl font-semibold text-primary mb-6">
            {t("footer.popularTours.title")}
          </h3>
          <ul className="space-y-3 text-sm">
            {t("footer.popularTours.items", { returnObjects: true }).map(
              (item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 hover:text-primary transition cursor-pointer"
                >
                  › {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-primary mb-6">
            {t("footer.contact.title")}
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-primary mt-1" />
              <p className="text-text-secondary">
                {t("footer.contact.address")}
              </p>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-primary" />
              <p className="text-text-secondary">{t("footer.contact.phone")}</p>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-primary" />
              <p className="text-text-secondary">{t("footer.contact.email")}</p>
            </li>
            <li className="flex items-center gap-3">
              <FaClock className="text-primary" />
              <p className="text-text-secondary">{t("footer.contact.hours")}</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-500/10 mt-14 pt-6 text-center text-sm text-text-muted">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6">
          <p>{t("footer.bottom.copyright")}</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            {t("footer.bottom.links", { returnObjects: true }).map(
              (item, index) => (
                <a
                  key={index}
                  className="hover:text-primary transition cursor-pointer"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
