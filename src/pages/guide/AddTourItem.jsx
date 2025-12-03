import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { MdTitle, MdLocationOn, MdMovie } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";

const contentTypes = ["video", "audio", "text", "image", "interactive"];

export default function AddTourItem() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({ longitude: 31.2357, latitude: 30.0444 }); // Default: Cairo
  const [showCoordinatesInput, setShowCoordinatesInput] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    script: "",
    contentType: "video",
    coordinateLong: coordinates.longitude,
    coordinateLat: coordinates.latitude,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoordinateChange = (type, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCoordinates((prev) => ({
        ...prev,
        [type]: numValue,
      }));
      setFormData((prev) => ({
        ...prev,
        [type === "longitude" ? "coordinateLong" : "coordinateLat"]: numValue,
      }));
    }
  };

  const handleMapClick = (lat, lng) => {
    setCoordinates({ longitude: lng, latitude: lat });
    setFormData((prev) => ({
      ...prev,
      coordinateLong: lng,
      coordinateLat: lat,
    }));
  };

  const validateForm = () => {
    if (!formData.title || formData.title.length < 3) {
      setError("Title must be at least 3 characters long");
      return false;
    }
    if (!formData.script || formData.script.length === 0) {
      setError("Script cannot be empty");
      return false;
    }
    if (formData.script.length > 5000) {
      setError("Script must be at most 5000 characters");
      return false;
    }
    if (!coordinates.longitude || !coordinates.latitude) {
      setError("Location coordinates are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("tour", tourId);
      formDataToSend.append("script", formData.script);
      formDataToSend.append("contentType", formData.contentType);
      
      // Send coordinates as JSON string (backend preprocessor will parse it)
      const locationData = {
        type: "Point",
        coordinates: [coordinates.longitude, coordinates.latitude],
      };
      formDataToSend.append("location", JSON.stringify(locationData));

      const response = await fetch("http://localhost:3000/api/tourItems", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create tour item");
      }

      const result = await response.json();
      setSuccess("Tour item created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        script: "",
        contentType: "video",
        coordinateLong: 31.2357,
        coordinateLat: 30.0444,
      });
      setCoordinates({ longitude: 31.2357, latitude: 30.0444 });

      // Redirect back after 2 seconds
      setTimeout(() => {
        navigate(`/guide/dashboard`);
      }, 2000);
    } catch (err) {
      console.error("Error creating tour item:", err);
      setError(err.message || "An error occurred while creating the tour item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex justify-center items-center bg-black overflow-hidden px-4 sm:px-6 lg:px-8 py-12">
      <div className="absolute inset-0">
        <img 
          src="src/assets/images/loginBg.webp" 
          className="h-full w-full object-cover opacity-20" 
          alt="bg-add-item" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/70 to-[#050505]" />
      </div>

      <div className="relative w-full max-w-2xl px-6 sm:px-8 md:px-10 py-10 rounded-2xl border border-[#f7c95f]/20 bg-[#0c0c0c] backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(247,201,95,0.2)] overflow-hidden">
        <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#f7c95f] to-transparent opacity-50" />

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/guide/dashboard")}
            className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#f7c95f]"
          >
            <IoArrowBack className="h-6 w-6" />
          </button>
          <h2 className="bg-gradient-to-r from-[#f7c95f] via-[#e9dcc0] to-[#f7c95f] bg-clip-text text-transparent text-2xl md:text-3xl font-extrabold">
            Add Tour Item
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div className="relative">
            <MdTitle className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
              focusedInput === "title" ? "text-[#f7c95f]" : "text-[#bfb191]"
            }`} />
            <input
              type="text"
              name="title"
              placeholder="Tour Item Title"
              value={formData.title}
              onChange={handleChange}
              onFocus={() => setFocusedInput("title")}
              onBlur={() => setFocusedInput(null)}
              maxLength={100}
              required
              className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50"
            />
            <span className="text-xs text-gray-400 mt-1">{formData.title.length}/100</span>
          </div>

          {/* Content Type */}
          <div className="relative">
            <MdMovie className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
              focusedInput === "contentType" ? "text-[#f7c95f]" : "text-[#bfb191]"
            }`} />
            <select
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
              onFocus={() => setFocusedInput("contentType")}
              onBlur={() => setFocusedInput(null)}
              className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50"
            >
              {contentTypes.map((type) => (
                <option key={type} value={type} className="bg-[#0a0a0a]">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Location Section */}
          <div className="border border-[#2b2b2b] rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FaMapLocationDot className="text-[#f7c95f]" />
              <h3 className="text-[#f7c95f] font-semibold">Location (Coordinates)</h3>
            </div>

            {/* Coordinates Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <MdLocationOn className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  focusedInput === "longitude" ? "text-[#f7c95f]" : "text-[#bfb191]"
                }`} />
                <input
                  type="number"
                  placeholder="Longitude"
                  value={coordinates.longitude}
                  onChange={(e) => handleCoordinateChange("longitude", e.target.value)}
                  onFocus={() => setFocusedInput("longitude")}
                  onBlur={() => setFocusedInput(null)}
                  step="0.0001"
                  required
                  className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50"
                />
              </div>
              <div className="relative">
                <MdLocationOn className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  focusedInput === "latitude" ? "text-[#f7c95f]" : "text-[#bfb191]"
                }`} />
                <input
                  type="number"
                  placeholder="Latitude"
                  value={coordinates.latitude}
                  onChange={(e) => handleCoordinateChange("latitude", e.target.value)}
                  onFocus={() => setFocusedInput("latitude")}
                  onBlur={() => setFocusedInput(null)}
                  step="0.0001"
                  required
                  className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Current location: [{coordinates.longitude.toFixed(4)}, {coordinates.latitude.toFixed(4)}]
            </p>
          </div>

          {/* Script */}
          <div className="relative">
            <FaList className={`absolute left-4 top-4 transition-colors duration-300 ${
              focusedInput === "script" ? "text-[#f7c95f]" : "text-[#bfb191]"
            }`} />
            <textarea
              name="script"
              placeholder="Enter script/content (max 5000 characters)"
              value={formData.script}
              onChange={handleChange}
              onFocus={() => setFocusedInput("script")}
              onBlur={() => setFocusedInput(null)}
              maxLength={5000}
              rows={6}
              required
              className="w-full rounded-xl border border-[#2b2b2b] bg-[#0a0a0a]/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#f7c95f] focus:ring-1 focus:ring-[#f7c95f]/50 resize-none"
            />
            <span className="text-xs text-gray-400 mt-1">{formData.script.length}/5000</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/guide/dashboard")}
              className="w-1/2 py-3 border border-[#f7c95f] rounded-xl text-[#f7c95f] font-semibold transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:bg-[#1a1a1a] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-3 bg-gradient-to-r from-[#c9a45f] to-[#aa853c] rounded-xl text-black font-semibold transition-transform duration-300 ease-out transform hover:-translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Tour Item"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
