import { useState, useMemo, useEffect } from "react";
import DestinationsHero from './../../components/allDestinations/DestinationsHero';
import DestinationsFilter from './../../components/allDestinations/DestinationsFilter';
import DestinationsGrid from './../../components/allDestinations/DestinationsGrid';
import LoadingScreen from "../../components/common/LoadingScreen";

export default function AllDestinationPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("recommended");
    const [selectedRegion, setSelectedRegion] = useState("all");
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // --- Data ---
    const destinations = [
        {
            id: 1,
            name: "Cairo",
            region: "Nile Valley",
            tagline: "City of a Thousand Minarets",
            description: "The sprawling capital, home to Giza Pyramids, Khan el-Khalili, and endless history.",
            image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800",
            highlights: ["Pyramids", "Museum", "Old Cairo"],
            color: "from-amber-500/20 to-orange-600/20",
            price: 2500,
            rating: 4.8,
        },
        {
            id: 2,
            name: "Luxor",
            region: "Nile Valley",
            tagline: "World's Greatest Open-Air Museum",
            description: "The ancient city of Thebes, featuring Karnak, Luxor Temple, and the Valley of the Kings.",
            image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800",
            highlights: ["Karnak", "Valley of Kings", "Balloons"],
            color: "from-blue-500/20 to-purple-600/20",
            price: 3200,
            rating: 4.9,
        },
        {
            id: 3,
            name: "Aswan",
            region: "Nile Valley",
            tagline: "Gateway to Nubian Culture",
            description: "A serene Nile city famous for Philea Temple, the High Dam, and colorful Nubian villages.",
            image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800",
            highlights: ["Abu Simbel", "Philae", "Nubian Village"],
            color: "from-teal-500/20 to-cyan-600/20",
            price: 2800,
            rating: 4.7,
        },
        {
            id: 7,
            name: "Giza",
            region: "Nile Valley",
            tagline: "Home of the Great Pyramids",
            description: "The iconic site of the Sphinx and the Great Pyramids, a testament to ancient engineering.",
            image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800",
            highlights: ["Great Sphinx", "Pyramids", "Solar Boat"],
            color: "from-yellow-500/20 to-orange-600/20",
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
            color: "from-stone-500/20 to-amber-600/20",
            price: 1500,
            rating: 4.5,
        },
        {
            id: 9,
            name: "Sohag",
            region: "Nile Valley",
            tagline: "Heart of Coptic History",
            description: "Famous for the Red and White Monasteries and the temple of Abydos.",
            image: "https://images.unsplash.com/photo-1669222666710-1418837265a0?w=800",
            highlights: ["Abydos Temple", "Red Monastery", "National Museum"],
            color: "from-red-500/20 to-rose-600/20",
            price: 1600,
            rating: 4.6,
        },
        {
            id: 10,
            name: "Qena",
            region: "Nile Valley",
            tagline: "The Temple City",
            description: "Home to the magnificent Dendera Temple complex dedicated to Hathor.",
            image: "https://images.unsplash.com/photo-1637703310029-7945c719542e?w=800",
            highlights: ["Dendera Temple", "Nile Views", "Local Souq"],
            color: "from-indigo-500/20 to-blue-600/20",
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
            color: "from-orange-500/20 to-red-600/20",
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
            color: "from-green-500/20 to-emerald-600/20",
            price: 1300,
            rating: 4.1,
        },
        {
            id: 4,
            name: "Alexandria",
            region: "Mediterranean",
            tagline: "Pearl of the Mediterranean",
            description: "Discover coastal charm, ancient libraries, and Roman amphitheaters.",
            image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800",
            highlights: ["Bibliotheca", "Citadel", "Catacombs"],
            color: "from-indigo-500/20 to-blue-600/20",
            price: 1800,
            rating: 4.6,
        },
        {
            id: 13,
            name: "Marsa Matruh",
            region: "Mediterranean",
            tagline: "The Egyptian Maldives",
            description: "Crystal clear waters and white sandy beaches on the north coast.",
            image: "https://images.unsplash.com/photo-1626278854823-3b473da5743a?w=800",
            highlights: ["Ageeba Beach", "Cleopatra Bath", "White Sand"],
            color: "from-cyan-500/20 to-blue-500/20",
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
            color: "from-sky-500/20 to-indigo-600/20",
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
            color: "from-teal-500/20 to-green-600/20",
            price: 1500,
            rating: 4.3,
        },
        {
            id: 5,
            name: "Hurghada",
            region: "Red Sea",
            tagline: "Red Sea Paradise",
            description: "Dive into crystal-clear waters, vibrant coral reefs, and endless resorts.",
            image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
            highlights: ["Diving", "Giftun Island", "Safari"],
            color: "from-emerald-500/20 to-green-600/20",
            price: 4000,
            rating: 4.8,
        },
        {
            id: 16,
            name: "Sharm El Sheikh",
            region: "Red Sea",
            tagline: "City of Peace",
            description: "World-class diving, luxury resorts, and vibrant nightlife in Sinai.",
            image: "https://images.unsplash.com/photo-1544526226-d4568090de8d?w=800",
            highlights: ["Ras Mohammed", "Soho Square", "Naama Bay"],
            color: "from-pink-500/20 to-rose-600/20",
            price: 4500,
            rating: 4.8,
        },
        {
            id: 17,
            name: "Dahab",
            region: "Red Sea",
            tagline: "The Golden Chill",
            description: "A laid-back beach town famous for the Blue Hole and windsurfing.",
            image: "https://images.unsplash.com/photo-1682687220509-61b8a906ca19?w=800",
            highlights: ["Blue Hole", "Blue Lagoon", "Diving"],
            color: "from-yellow-500/20 to-amber-600/20",
            price: 2000,
            rating: 4.9,
        },
        {
            id: 18,
            name: "Marsa Alam",
            region: "Red Sea",
            tagline: "The Diver's Dream",
            description: "Pristine reefs, sea turtles, and dugongs in a quiet setting.",
            image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800",
            highlights: ["Abu Dabbab", "Dolphin House", "Wadi El Gemal"],
            color: "from-cyan-500/20 to-teal-600/20",
            price: 3800,
            rating: 4.7,
        },
        {
            id: 19,
            name: "Nuweiba",
            region: "Red Sea",
            tagline: "Sinai's Hidden Gem",
            description: "Quiet beaches and Bedouin camps between mountains and sea.",
            image: "https://images.unsplash.com/photo-1562095648-5c4d0c9f1a23?w=800",
            highlights: ["Colored Canyon", "Bedouin Camps"],
            color: "from-orange-500/20 to-red-600/20",
            price: 1800,
            rating: 4.5,
        },
        {
            id: 20,
            name: "Taba",
            region: "Red Sea",
            tagline: "Gateway to the Gulf",
            description: "Luxury resorts overlooking the Gulf of Aqaba and three countries.",
            image: "https://images.unsplash.com/photo-1582234032127-14e36511470e?w=800",
            highlights: ["Fjord Bay", "Salah El Din Castle"],
            color: "from-blue-500/20 to-indigo-600/20",
            price: 3000,
            rating: 4.4,
        },
        {
            id: 6,
            name: "Siwa Oasis",
            region: "Desert",
            tagline: "Sunset Paradise",
            description: "Salt lakes, palm groves, and unique Amazigh culture.",
            image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
            highlights: ["Salt Lakes", "Shali Fortress", "Fatnas Island"],
            color: "from-yellow-500/20 to-amber-600/20",
            price: 3500,
            rating: 4.9,
        },
        {
            id: 21,
            name: "Fayoum",
            region: "Desert",
            tagline: "Egypt's Oldest City",
            description: "Waterfalls, pottery villages, and the Valley of Whales.",
            image: "https://images.unsplash.com/photo-1600520623254-20d36750307c?w=800",
            highlights: ["Wadi El Rayan", "Tunis Village", "Wadi El Hitan"],
            color: "from-green-500/20 to-lime-600/20",
            price: 1800,
            rating: 4.6,
        },
        {
            id: 22,
            name: "Bahariya Oasis",
            region: "Desert",
            tagline: "The Black Desert",
            description: "Gateway to the Black and White Deserts and hot springs.",
            image: "https://images.unsplash.com/photo-1517411032315-54ef2cb003ac?w=800",
            highlights: ["Black Desert", "Crystal Mountain", "Hot Springs"],
            color: "from-stone-500/20 to-gray-600/20",
            price: 2500,
            rating: 4.5,
        },
        {
            id: 23,
            name: "Farafra Oasis",
            region: "Desert",
            tagline: "Land of the White Desert",
            description: "Surreal chalk rock formations in the White Desert National Park.",
            image: "https://images.unsplash.com/photo-1548588627-f978862b85e1?w=800",
            highlights: ["White Desert", "Camping", "Star Gazing"],
            color: "from-orange-100/20 to-white/10",
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
            color: "from-emerald-500/20 to-teal-600/20",
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
            color: "from-blue-500/20 to-cyan-600/20",
            price: 1300,
            rating: 4.2,
        },
    ];

    const regions = ["all", "Nile Valley", "Red Sea", "Mediterranean", "Desert", "Canal"];

    const filteredDestinations = useMemo(() => {
        let result = [...destinations];

        if (searchQuery) {
            result = result.filter((dest) =>
                dest.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedRegion !== "all") {
            result = result.filter((dest) => dest.region === selectedRegion);
        }

        if (sortBy === "price-low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [destinations, searchQuery, sortBy, selectedRegion]);

    return (
        <div className="relative text-text overflow-hidden bg-background w-full">
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden"></div>

            <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">

                <DestinationsHero />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8 min-w-0">

                    <div className="lg:col-span-1 min-w-0">
                        <DestinationsFilter
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedRegion={selectedRegion}
                            setSelectedRegion={setSelectedRegion}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            regions={regions}
                            filteredCount={filteredDestinations.length}
                            totalCount={destinations.length} />
                    </div>

                    <div className="lg:col-span-3 min-w-0">
                        {isLoading ? (
                            <LoadingScreen />
                        ) : (
                            <DestinationsGrid
                                destinations={filteredDestinations}
                                searchQuery={searchQuery} 
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}