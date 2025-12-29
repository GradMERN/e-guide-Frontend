import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth as useAuthContext } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import userService from "../../apis/userService";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUtils";

const countryCities = {
  Egypt: ["Cairo", "Alexandria", "Giza", "Luxor", "Aswan", "Sharm El Sheikh", "Hurghada", "Port Said", "Suez", "Tanta", "Mansoura", "Zagazig", "Ismailia", "Faiyum", "Damanhur", "Beni Suef", "Minya", "Sohag", "Assiut", "Arish", "Al-Mahalla al-Kubra", "Kafr El Sheikh", "El-Minya", "Damietta", "Qena"],
  Usa: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  Uk: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
  Italy: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Florence"],
  Spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  Japan: ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Kyoto"],
  China: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"],
  India: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai"],
  Brazil: ["Sao Paulo", "Rio de Janeiro", "Brasilia", "Salvador", "Fortaleza"],
  Mexico: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana"],
  Russia: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan"],
  Turkey: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  Netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
  Sweden: ["Stockholm", "Gothenburg", "Malmo", "Uppsala"],
  Norway: ["Oslo", "Bergen", "Trondheim", "Stavanger"],
};

const CustomSelect = ({ id, name, value, onChange, options, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      const maxDropdownHeight = 300;
      const dropdownPadding = 20;
      
      let finalMaxHeight = Math.min(maxDropdownHeight, spaceBelow - dropdownPadding);
      let openUpward = false;
      
      if (finalMaxHeight < 200 && spaceAbove > spaceBelow) {
        openUpward = true;
        finalMaxHeight = Math.min(maxDropdownHeight, spaceAbove - dropdownPadding);
      }
      
      finalMaxHeight = Math.max(finalMaxHeight, 150);
      
      setDropdownStyle({
        maxHeight: `${finalMaxHeight}px`,
        top: openUpward ? 'auto' : '100%',
        bottom: openUpward ? '100%' : 'auto',
        marginTop: openUpward ? '0' : '0.25rem',
        marginBottom: openUpward ? '0.25rem' : '0',
      });
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange({ target: { name, value: option } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const displayValue = value || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button ref={buttonRef} type="button" onClick={() => !disabled && setIsOpen(!isOpen)} disabled={disabled} className="appearance-none border-2 w-full px-4 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 text-left disabled:opacity-50 disabled:cursor-not-allowed" style={{backgroundColor: "var(--surface)",color: value ? "var(--text)" : "var(--text-muted)",borderColor: "var(--border)",}}>
        {displayValue}
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--text-muted)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full rounded-md shadow-lg border-2" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)",...dropdownStyle,}}>
          <div className="p-2">
            <input ref={inputRef} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2" style={{backgroundColor: "var(--background)", color: "var(--text)",borderColor: "var(--border)",}}autoFocus/>
          </div>
          <div className="overflow-y-auto" style={{  maxHeight: dropdownStyle.maxHeight ? `calc(${dropdownStyle.maxHeight} - 60px)` : "240px" }}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-center" style={{ color: "var(--text-muted)" }}>
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button key={option} type="button" onClick={() => handleSelect(option)} className="w-full text-left px-4 py-2 hover:bg-opacity-80 transition-colors" style={{ backgroundColor: value === option ? "var(--primary-light)" : "transparent", color: "var(--text)",}}
                  onMouseEnter={(e) => {
                    if (value !== option) {
                      e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}>
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProfilePhoto = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthContext();
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("invalidFileType") || "Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("fileTooLarge") || "File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const response = await userService.uploadProfilePicture(formData);

      const updatedUser = response.data || response;

      updateUser(updatedUser);
      const token = localStorage.getItem("token");
      dispatch(loginSuccess({ user: updatedUser, token }));

      toast.success(
        t("photoUpdatedSuccessfully") || "Profile photo updated successfully"
      );
    } catch (error) {
      console.error("Failed to upload photo:", error);
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
      <h3 className="text-xl font-semibold mb-4 sm:text-start text-center">
        {t("profilePhoto")}
      </h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-black font-bold text-3xl border-2 overflow-hidden" style={{ borderColor: "var(--primary)", background: getImageUrl(user?.avatar) ? "transparent" : "linear-gradient(to right, #C7A15C, #E2C784)",}}>
            {getImageUrl(user?.avatar) ? (
              <img src={getImageUrl(user.avatar)} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Error";}}/>
            ) : ( user?.firstName?.charAt(0) || "U")}
          </div>
          <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-1 cursor-pointer hover:bg-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" style={{ color: "white" }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </label>
          <input type="file" id="photo-upload" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading}/>
        </div>
        <div className="text-center sm:text-start">
          <label htmlFor="photo-upload" className={`py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out cursor-pointer inline-block ${ uploading ? "opacity-50 cursor-not-allowed" : ""}`} style={{ background: "var(--button-bg)", color: "var(--text-button)",}}>
            {uploading ? "Uploading..." : t("uploadNewPhoto")}
          </label>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            {t("photoConstraints")}
          </p>
        </div>
      </div>
    </div>
  );
};

const BasicDetails = ({ formData, handleChange }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
      <h3 className="text-xl font-semibold mb-4">{t("basicDetails")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            {t("firstName")}
          </label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName || ""} onChange={handleChange} className="border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2" style={{ backgroundColor: "var(--surface)", color: "var(--text)", borderColor: "var(--border)",}}/>
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            {t("lastName")}
          </label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName || ""} onChange={handleChange} className="border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2" style={{ backgroundColor: "var(--surface)", color: "var(--text)", borderColor: "var(--border)",}}/>
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-2">
            {t("age")}
          </label>
          <input type="number" id="age" name="age" value={formData.age || ""} onChange={handleChange} placeholder="Enter your age" className="border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2" style={{ backgroundColor: "var(--surface)", color: "var(--text)", borderColor: "var(--border)",}}/>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            {t("number")}
          </label>
          <input type="tel" id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} className="border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2" style={{ backgroundColor: "var(--surface)", color: "var(--text)", borderColor: "var(--border)",}}/>
        </div>
      </div>
    </div>
  );
};

const LocationInfo = ({ formData, handleChange }) => {
  const { t } = useTranslation();
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (formData.country) {
      const formattedCountry = formData.country.charAt(0).toUpperCase() + formData.country.slice(1).toLowerCase();
      setAvailableCities(countryCities[formattedCountry] || []);
    } else {
      setAvailableCities([]);
    }
  }, [formData.country]);

  return (
    <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
      <h3 className="text-xl font-semibold mb-4">{t("locationInformation")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-2">
            {t("country")}
          </label>
          <CustomSelect id="country" name="country" value={formData.country} onChange={handleChange} options={Object.keys(countryCities)} placeholder={t("selectCountry") || "Select Country"}/>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-2">
            {t("city")}
          </label>
          <CustomSelect id="city" name="city" value={formData.city} onChange={handleChange} options={availableCities} placeholder={t("selectCity") || "Select City"} disabled={!formData.country}/>
        </div>
      </div>
    </div>
  );
};

function Address({ formData, handleChange }) {
  return (
    <div className="space-y-8">
      <LocationInfo formData={formData} handleChange={handleChange} />
    </div>
  );
}

export default function Info() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthContext();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age !== undefined && user.age !== null ? user.age : "",
        phone: user.phone || "",
        country: user.country || "",
        city: user.city || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "country") {
        newData.city = "";
      }
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        age: formData.age !== "" ? Number(formData.age) : null,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };
      
      const response = await userService.updateProfile(dataToSubmit);
      const updatedUser = response.data || response;

      updateUser(updatedUser);
      const token = localStorage.getItem("token");
      dispatch(loginSuccess({ user: updatedUser, token }));

      toast.success(t("profileUpdatedSuccessfully") || "Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-2xl min-h-screen max-w-6xl mx-auto w-full pb-8" style={{ backgroundColor: "var(--background)", color: "var(--text)" }}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {t("personalInformation")}
      </h2>
      <div className="space-y-8">
        <ProfilePhoto user={user} />
        <BasicDetails formData={formData} handleChange={handleChange} />
        <Address formData={formData} handleChange={handleChange} />
      </div>

      <div className="mt-8 flex justify-end">
        <button type="button" onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto py-2 px-8 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: "var(--button-bg)", color: "var(--text-button)", }}>
          {loading ? "Saving..." : t("saveChanges")}
        </button>
      </div>
    </div>
  );
}