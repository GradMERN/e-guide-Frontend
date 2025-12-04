import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt, FaStar, FaClock, FaArrowLeft,
  FaCamera, FaTemperatureHigh, FaCalendarAlt, FaCheck,
  FaSun, FaTshirt, FaMoneyBillWave, FaPassport
} from "react-icons/fa";
import { GiAncientRuins, GiCommercialAirplane } from "react-icons/gi";

// --- FULL DATA: 25 Destinations ---
const destinationsData = [
  {
    id: 1,
    name: "Cairo",
    region: "Nile Valley",
    tagline: "City of a Thousand Minarets",
    description: "The sprawling capital, home to Giza Pyramids, Khan el-Khalili, and endless history.",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200",
    highlights: ["Pyramids", "Museum", "Old Cairo"],
    price: 2500,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Luxor",
    region: "Nile Valley",
    tagline: "World's Greatest Open-Air Museum",
    description: "The ancient city of Thebes, featuring Karnak, Luxor Temple, and the Valley of the Kings.",
    image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200",
    highlights: ["Karnak", "Valley of Kings", "Balloons"],
    price: 3200,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Aswan",
    region: "Nile Valley",
    tagline: "Gateway to Nubian Culture",
    description: "A serene Nile city famous for Philea Temple, the High Dam, and colorful Nubian villages.",
    image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200",
    highlights: ["Abu Simbel", "Philae", "Nubian Village"],
    price: 2800,
    rating: 4.7,
  },
  {
    id: 7,
    name: "Giza",
    region: "Nile Valley",
    tagline: "Home of the Great Pyramids",
    description: "The iconic site of the Sphinx and the Great Pyramids, a testament to ancient engineering.",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200",
    highlights: ["Great Sphinx", "Pyramids", "Solar Boat"],
    price: 2000,
    rating: 4.9,
  },
  {
    id: 8,
    name: "Minya",
    region: "Nile Valley",
    tagline: "Bride of Upper Egypt",
    description: "Rich in pharaonic history, featuring Tel El Amarna and Beni Hasan tombs.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beni_Hassan_tomb_entrance.jpg/800px-Beni_Hassan_tomb_entrance.jpg",
    highlights: ["Tel El Amarna", "Beni Hasan", "Tuna El Gebel"],
    price: 1500,
    rating: 4.5,
  },
  {
    id: 9,
    name: "Sohag",
    region: "Nile Valley",
    tagline: "Heart of Coptic History",
    description: "Famous for the Red and White Monasteries and the temple of Abydos.",
    image: "https://images.unsplash.com/photo-1669222666710-1418837265a0?w=1200",
    highlights: ["Abydos Temple", "Red Monastery", "National Museum"],
    price: 1600,
    rating: 4.6,
  },
  {
    id: 10,
    name: "Qena",
    region: "Nile Valley",
    tagline: "The Temple City",
    description: "Home to the magnificent Dendera Temple complex dedicated to Hathor.",
    image: "https://images.unsplash.com/photo-1637703310029-7945c719542e?w=1200",
    highlights: ["Dendera Temple", "Nile Views", "Local Souq"],
    price: 1700,
    rating: 4.6,
  },
  {
    id: 11,
    name: "Beni Suef",
    region: "Nile Valley",
    tagline: "Land of the Meidum Pyramid",
    description: "Known for the collapsed pyramid of Meidum and proximity to Fayoum.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Meidum_Pyramid.jpg",
    highlights: ["Meidum Pyramid", "Nile Corniche", "Museum"],
    price: 1200,
    rating: 4.2,
  },
  {
    id: 12,
    name: "Asyut",
    region: "Nile Valley",
    tagline: "Capital of Upper Egypt",
    description: "A major agricultural and trade hub with ancient monasteries.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Assiut_Barrage.jpg/800px-Assiut_Barrage.jpg",
    highlights: ["Virgin Mary Monastery", "Nile Barrage"],
    price: 1300,
    rating: 4.1,
  },
  {
    id: 4,
    name: "Alexandria",
    region: "Mediterranean",
    tagline: "Pearl of the Mediterranean",
    description: "Discover coastal charm, ancient libraries, and Roman amphitheaters.",
    image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200",
    highlights: ["Bibliotheca", "Citadel", "Catacombs"],
    price: 1800,
    rating: 4.6,
  },
  {
    id: 13,
    name: "Marsa Matruh",
    region: "Mediterranean",
    tagline: "The Egyptian Maldives",
    description: "Crystal clear waters and white sandy beaches on the north coast.",
    image: "https://images.unsplash.com/photo-1626278854823-3b473da5743a?w=1200",
    highlights: ["Ageeba Beach", "Cleopatra Bath", "White Sand"],
    price: 2200,
    rating: 4.7,
  },
  {
    id: 14,
    name: "Port Said",
    region: "Mediterranean",
    tagline: "City of the Canal",
    description: "A cosmopolitan city at the northern entrance of the Suez Canal.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Port_Said_Lighthouse.jpg/800px-Port_Said_Lighthouse.jpg",
    highlights: ["Suez Canal", "Lighthouse", "Port Fouad"],
    price: 1400,
    rating: 4.4,
  },
  {
    id: 15,
    name: "Damietta",
    region: "Mediterranean",
    tagline: "Where River Meets Sea",
    description: "Famous for Ras El Bar resort and high-quality furniture and sweets.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ras_El_Bar_Lighthouse.jpg/800px-Ras_El_Bar_Lighthouse.jpg",
    highlights: ["Ras El Bar", "Lesan Area", "Furniture"],
    price: 1500,
    rating: 4.3,
  },
  {
    id: 5,
    name: "Hurghada",
    region: "Red Sea",
    tagline: "Red Sea Paradise",
    description: "Dive into crystal-clear waters, vibrant coral reefs, and endless resorts.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
    highlights: ["Diving", "Giftun Island", "Safari"],
    price: 4000,
    rating: 4.8,
  },
  {
    id: 16,
    name: "Sharm El Sheikh",
    region: "Red Sea",
    tagline: "City of Peace",
    description: "World-class diving, luxury resorts, and vibrant nightlife in Sinai.",
    image: "https://images.unsplash.com/photo-1544526226-d4568090de8d?w=1200",
    highlights: ["Ras Mohammed", "Soho Square", "Naama Bay"],
    price: 4500,
    rating: 4.8,
  },
  {
    id: 17,
    name: "Dahab",
    region: "Red Sea",
    tagline: "The Golden Chill",
    description: "A laid-back beach town famous for the Blue Hole and windsurfing.",
    image: "https://images.unsplash.com/photo-1682687220509-61b8a906ca19?w=1200",
    highlights: ["Blue Hole", "Blue Lagoon", "Diving"],
    price: 2000,
    rating: 4.9,
  },
  {
    id: 18,
    name: "Marsa Alam",
    region: "Red Sea",
    tagline: "The Diver's Dream",
    description: "Pristine reefs, sea turtles, and dugongs in a quiet setting.",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200",
    highlights: ["Abu Dabbab", "Dolphin House", "Wadi El Gemal"],
    price: 3800,
    rating: 4.7,
  },
  {
    id: 19,
    name: "Nuweiba",
    region: "Red Sea",
    tagline: "Sinai's Hidden Gem",
    description: "Quiet beaches and Bedouin camps between mountains and sea.",
    image: "https://images.unsplash.com/photo-1562095648-5c4d0c9f1a23?w=1200",
    highlights: ["Colored Canyon", "Bedouin Camps"],
    price: 1800,
    rating: 4.5,
  },
  {
    id: 20,
    name: "Taba",
    region: "Red Sea",
    tagline: "Gateway to the Gulf",
    description: "Luxury resorts overlooking the Gulf of Aqaba and three countries.",
    image: "https://images.unsplash.com/photo-1582234032127-14e36511470e?w=1200",
    highlights: ["Fjord Bay", "Salah El Din Castle"],
    price: 3000,
    rating: 4.4,
  },
  {
    id: 6,
    name: "Siwa Oasis",
    region: "Desert",
    tagline: "Sunset Paradise",
    description: "Salt lakes, palm groves, and unique Amazigh culture.",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200",
    highlights: ["Salt Lakes", "Shali Fortress", "Fatnas Island"],
    price: 3500,
    rating: 4.9,
  },
  {
    id: 21,
    name: "Fayoum",
    region: "Desert",
    tagline: "Egypt's Oldest City",
    description: "Waterfalls, pottery villages, and the Valley of Whales.",
    image: "https://images.unsplash.com/photo-1600520623254-20d36750307c?w=1200",
    highlights: ["Wadi El Rayan", "Tunis Village", "Wadi El Hitan"],
    price: 1800,
    rating: 4.6,
  },
  {
    id: 22,
    name: "Bahariya Oasis",
    region: "Desert",
    tagline: "The Black Desert",
    description: "Gateway to the Black and White Deserts and hot springs.",
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb003ac?w=1200",
    highlights: ["Black Desert", "Crystal Mountain", "Hot Springs"],
    price: 2500,
    rating: 4.5,
  },
  {
    id: 23,
    name: "Farafra Oasis",
    region: "Desert",
    tagline: "Land of the White Desert",
    description: "Surreal chalk rock formations in the White Desert National Park.",
    image: "https://images.unsplash.com/photo-1548588627-f978862b85e1?w=1200",
    highlights: ["White Desert", "Camping", "Star Gazing"],
    price: 2800,
    rating: 4.8,
  },
  {
    id: 24,
    name: "Ismailia",
    region: "Canal",
    tagline: "City of Gardens",
    description: "Green landscapes and colonial architecture along the Suez Canal.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Suez_Canal_Ismailia.jpg/800px-Suez_Canal_Ismailia.jpg",
    highlights: ["Timsah Lake", "Canal Views", "Gardens"],
    price: 1300,
    rating: 4.3,
  },
  {
    id: 25,
    name: "Suez",
    region: "Canal",
    tagline: "The Southern Gate",
    description: "Historic port city at the southern end of the Suez Canal.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Suez_Port_Tewfik.jpg/800px-Suez_Port_Tewfik.jpg",
    highlights: ["Port Tewfik", "Corniche", "Ganayen"],
    price: 1300,
    rating: 4.2,
  },
];

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = destinationsData.find(d => d.id === parseInt(id));
    setDestination(found || destinationsData[0]);
  }, [id]);

  if (!destination) return <div className="text-white text-center pt-32">Loading...</div>;

  const attractions = destination.highlights.map(h => ({ name: h, type: "Must See" }));


  const isBeach = destination.region === "Red Sea" || destination.region === "Mediterranean";

  return (
    <div
      className="relative text-white min-h-screen w-full overflow-x-hidden bg-black"
      style={{ background: "linear-gradient(#000000 100%)" }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: "rgba(255, 230, 160, 0.1)" }}></div>
        <div className="absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: "rgba(255, 214, 112, 0.1)" }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: "rgba(255, 201, 64, 0.1)" }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">


        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-[#c7a15c] transition-colors mb-6 text-sm sm:text-base cursor-pointer">
          <FaArrowLeft /> Back to Destinations
        </button>

        {/* Hero Section */}
        <div className="relative w-full h-[350px] md:h-[500px] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl">
          <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c7a15c]/20 border border-[#c7a15c]/50 backdrop-blur-md mb-4">
              <FaMapMarkerAlt className="text-[#c7a15c] text-xs" />
              <span className="text-[#c7a15c] text-xs font-bold uppercase tracking-wider">{destination.region}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 wrap-break-word leading-tight">{destination.name}</h1>
            <p className="text-white/80 text-sm md:text-lg mb-4 max-w-2xl line-clamp-2 md:line-clamp-none">{destination.tagline}</p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
              <span className="flex items-center gap-2"><FaStar className="text-yellow-400" /> {destination.rating}</span>
              <span className="flex items-center gap-2"><FaTemperatureHigh className="text-white/50" /> Oct - Apr</span>
              <span className="flex items-center gap-2"><FaClock className="text-white/50" /> 3-4 Days</span>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full min-w-0">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8 min-w-0">


            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-white/70 leading-relaxed text-sm md:text-lg wrap-break-word">{destination.description}</p>
            </div>


            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#c7a15c]/20 rounded-xl shrink-0"><GiAncientRuins className="text-2xl text-[#c7a15c]" /></div>
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl font-bold text-white truncate">Top Attractions</h2>
                  <p className="text-white/50 text-xs md:text-sm truncate">Must-visit spots in {destination.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attractions.map((spot, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5 hover:border-[#c7a15c]/50 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FaCamera className="text-white/70 group-hover:text-[#c7a15c]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-bold truncate">{spot.name}</h4>
                      <p className="text-white/40 text-xs truncate">{spot.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Experience Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {destination.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 min-w-5 shrink-0"><FaCheck className="text-[#c7a15c] text-sm" /></div>
                    <span className="text-white/80 text-sm leading-relaxed wrap-break-word">{item}</span>
                  </div>
                ))}
              </div>
            </div>


            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Travel Essentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#c7a15c]">
                    <FaSun />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Weather</h4>
                    <p className="text-white/60 text-xs mt-1">
                      Sunny & dry year-round. Highs of 35°C in summer, pleasant 20°C in winter.
                    </p>
                  </div>
                </div>


                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#c7a15c]">
                    <FaTshirt />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">What to Wear</h4>
                    <p className="text-white/60 text-xs mt-1">
                      {isBeach
                        ? "Light beachwear allowed at resorts. Modest dress recommended when visiting towns."
                        : "Conservative dress recommended. Cover shoulders and knees when visiting cultural sites."}
                    </p>
                  </div>
                </div>


                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#c7a15c]">
                    <FaMoneyBillWave />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Currency</h4>
                    <p className="text-white/60 text-xs mt-1">
                      Egyptian Pound (EGP). Cash is preferred for small shops and tips. Cards accepted at hotels.
                    </p>
                  </div>
                </div>


                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#c7a15c]">
                    <FaPassport />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Visa Info</h4>
                    <p className="text-white/60 text-xs mt-1">
                      Visa on arrival available for many nationalities (25 USD). E-Visa recommended.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN  */}
          <div className="lg:col-span-1 min-w-0">
            <div className="sticky top-28 space-y-6">


              <div className="bg-black/40 border border-[#c7a15c]/30 rounded-2xl p-6 backdrop-blur-md shadow-lg shadow-[#c7a15c]/5">
                <div className="mb-6">
                  <p className="text-white/60 text-sm mb-1">Tours starting from</p>
                  <div className="flex items-end gap-2 flex-wrap">
                    <span className="text-3xl font-bold text-white">{destination.price} EGP</span>
                    <span className="text-white/40 mb-1">/ person</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <label className="text-xs text-white/50 block mb-1">Travel Date</label>
                    <div className="flex items-center gap-2 text-white">
                      <FaCalendarAlt className="text-[#c7a15c]" />
                      <span className="text-sm">Select Dates</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/tours')}
                  className="w-full py-4 bg-[#c7a15c] text-black font-extrabold text-lg rounded-xl transition-all duration-300 transform hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(199,161,92,0.3)] hover:shadow-[0_0_30px_rgba(199,161,92,0.5)] flex items-center justify-center gap-2 cursor-pointer">
                  <GiCommercialAirplane className="text-xl" />
                  Explore Tours
                </button>

                <p className="text-center text-white/30 text-xs mt-4">Free cancellation up to 24 hours before trip.</p>
              </div>


              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-2">Need Help?</h3>
                <p className="text-white/60 text-sm mb-4">Speak to our expert travel guides to plan your perfect {destination.name} itinerary.</p>
                <a href="mailto:info@mysticegypttours.com" className="block text-[#c7a15c] text-sm font-bold hover:underline text-center">Contact Support →</a>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 0.5rem)); } }
        .animate-scroll { animation: scroll var(--animation-duration, 40s) linear infinite; animation-direction: var(--animation-direction, forwards); }
      `}</style>
    </div>
  );
}