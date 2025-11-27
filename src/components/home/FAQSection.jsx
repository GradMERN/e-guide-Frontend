import { useState, useEffect, useRef } from "react";
import {Pyramid,ChevronDown,Info,Landmark,Smartphone,User,MapPin,Globe} from "lucide-react";

const FAQSection = () => {
  const [openCategory, setOpenCategory] = useState(0);
  const [openItems, setOpenItems] = useState({});
  const [faqCategories, setFaqCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemRefs = useRef({});

  const iconMap = {
    info: Info,
    pyramid: Pyramid,
    landmark: Landmark,
    smartphone: Smartphone,
    user: User,
    mapPin: MapPin,
    globe: Globe,
  };

  const getSampleData = () => [
    {
      title: "About E-Tour Guide",
      icon: "info",
      borderColor: "border-amber-500",
      order: 1,
      questions: [
        {
          question: "What is E-Tour Guide?",
          answer:
            "E-Tour Guide is your comprehensive digital companion for exploring Egypt's wonders. We provide virtual tours, interactive maps, historical information, booking services, and personalized itineraries to make your Egyptian adventure seamless and unforgettable.",
          order: 1,
        },
        {
          question: "How does the E-Tour Guide platform work?",
          answer:
            "Simply create an account, browse our extensive collection of tours and destinations, customize your itinerary, and book experiences directly through our platform. Access audio guides, AR features, and real-time information during your visit.",
          order: 2,
        },
      ],
    },
    {
      title: "Tours & Experiences",
      icon: "landmark",
      borderColor: "border-blue-600",
      order: 2,
      questions: [
        {
          question: "What types of tours does E-Tour Guide offer?",
          answer:
            "We offer virtual tours, self-guided audio tours, private guided experiences, group tours, Nile cruises, desert safaris, cultural experiences, and customized itineraries. From the Pyramids of Giza to hidden gems in Aswan, we cover all of Egypt's treasures.",
          order: 1,
        },
        {
          question: "Can I customize my tour itinerary?",
          answer:
            "Yes! Use our itinerary builder to create a personalized experience. Select your preferred sites, adjust durations, add activities, and our smart algorithm will optimize routes and timing. Our travel experts can also help customize complex itineraries.",
          order: 2,
        },
        {
          question: "Do tours include skip-the-line access?",
          answer:
            "Many of our premium tours include priority access to popular sites like the Egyptian Museum, Valley of the Kings, and Abu Simbel. Look for the 'Skip-the-Line' badge when browsing tours.",
          order: 3,
        },
        {
          question: "How long do tours typically last?",
          answer:
            "Tour durations vary from 2-hour focused experiences to full-day adventures and multi-day journeys. Each tour listing clearly displays the duration, and you can filter by time commitment to find tours that fit your schedule.",
          order: 5,
        },
      ],
    },
    {
      title: "Website Features & Access",
      icon: "smartphone",
      borderColor: "border-teal-500",
      order: 4,
      questions: [
        {
          question: "Can I access E-Tour Guide on my mobile device?",
          answer:
            "Yes! Our website is fully responsive and optimized for mobile devices. Access all features directly through your mobile browser. We're also developing a Progressive Web App (PWA) for an even better mobile experience in the future.",
          order: 1,
        },
        {
          question: "Do I need to download anything to use E-Tour Guide?",
          answer:
            "No downloads required! Simply visit our website from any device with a browser. In the future, our PWA will allow you to add E-Tour Guide to your home screen for quick access, even with limited internet connectivity.",
          order: 2,
        },
        {
          question: "Can I save tours for offline viewing?",
          answer:
            "Currently, you need an internet connection to browse tours and access content. However, you can bookmark pages and save tour details. Our upcoming PWA feature will enable offline access to downloaded tours and guides.",
          order: 3,
        },
        {
          question: "What browsers work best with E-Tour Guide?",
          answer:
            "E-Tour Guide works on all modern browsers including Chrome, and Edge. For the best experience, we recommend using the latest version of your preferred browser on both desktop and mobile devices.",
          order: 4,
        },
      ],
    },
    {
      title: "Account & Membership",
      icon: "user",
      borderColor: "border-purple-500",
      order: 6,
      questions: [
        {
          question: "Is creating an account free?",
          answer:
            "Yes! Creating an E-Tour Guide account is completely free. Enjoy benefits like saved itineraries, booking history, personalized recommendations, exclusive deals, and loyalty rewards.",
          order: 1,
        },
        {
          question: "What are the membership tiers?",
          answer:
            "We offer Explorer (free), Traveler (premium), and Pharaoh (VIP) memberships. Premium tiers include extra discounts, priority support, free cancellations, exclusive tours, and reward points on every booking.",
          order: 2,
        },
        {
          question: "How do rewards and points work?",
          answer:
            "Earn points on every booking, review, and referral. Redeem points for discounts, free tours, upgrades, and exclusive experiences. Premium members earn double points and get birthday bonuses.",
          order: 3,
        },
        {
          question: "Can I share my account with family?",
          answer:
            "Premium and VIP memberships include family sharing for up to 5 members. Each person gets their own profile while sharing benefits like discounts, priority booking, and accumulated rewards.",
          order: 4,
        },
        {
          question: "How do I upgrade my membership?",
          answer:
            "Visit your account settings and click 'Upgrade Membership.' Choose your preferred tier, complete payment, and enjoy premium benefits immediately. You can upgrade or downgrade at any time.",
          order: 5,
        },
      ],
    },
    {
      title: "Destinations & Planning",
      icon: "mapPin",
      order: 8,
      questions: [
        {
          question: "Which Egyptian cities do you cover?",
          answer:
            "We cover all major tourist destinations including Cairo, Giza, Luxor, Aswan, Alexandria, Hurghada, Sharm El-Sheikh, Dahab, and the Western Desert oases. We're constantly adding new destinations and hidden gems.",
          order: 1,
        },
        {
          question: "What's the best time to visit Egypt?",
          answer:
            "October to April offers pleasant weather (20-25°C) and is ideal for sightseeing. Summer (May-September) is hot but less crowded with better prices. Red Sea resorts are great year-round for diving and beach activities.",
          order: 2,
        },
        {
          question: "How do I plan a multi-city itinerary?",
          answer:
            "Use our itinerary planner to add tours from different cities. The system automatically calculates travel time and suggests optimal routes. You can also chat with our travel experts for personalized multi-destination planning.",
          order: 3,
        },
        {
          question: "Can I visit lesser-known destinations?",
          answer:
            "Absolutely! Beyond famous sites, we offer tours to Siwa Oasis, White Desert, Fayoum, Abydos, Dendera, and many hidden treasures. Use our 'Off the Beaten Path' filter to discover unique experiences.",
          order: 5,
        },
      ],
    },
    {
      title: "Travel Tips & Information",
      icon: "globe",
      order: 12,
      questions: [
        {
          question: "Do I need a visa to visit Egypt?",
          answer:
            "Most nationalities can obtain a visa on arrival at Egyptian airports for $25 USD (30-day single entry). E-visas are also available online. Some countries require advance arrangements. Check current requirements for your nationality before traveling.",
          order: 1,
        },
        {
          question: "What should I pack for Egypt?",
          answer:
            "Pack lightweight, breathable clothing covering shoulders and knees. Bring comfortable walking shoes, sunscreen (SPF 50+), hat, sunglasses, and reusable water bottle. Winter evenings can be cool, so include a light jacket. Don't forget power adapters (Type C/F plugs).",
          order: 2,
        },
        {
          question: "What currency is used in Egypt?",
          answer:
            "Egyptian Pound (EGP or LE) is the official currency. US Dollars and Euros are widely accepted at tourist sites and hotels. ATMs are common in cities. Credit cards work at major establishments. Keep small bills for tips and local purchases.",
          order: 3,
        },
        {
          question: "How should I dress in Egypt?",
          answer:
            "Egypt is conservative. Dress modestly covering shoulders and knees, especially at religious sites and outside tourist areas. Lightweight, breathable fabrics work best. Women should carry a scarf for mosques. Beachwear is fine at resorts but cover up elsewhere.",
          order: 4,
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        throw new Error("Simulating API failure to use sample data.");
      } catch {
        setFaqCategories(getSampleData());
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleCategory = (categoryIndex) => {
    setOpenCategory((prev) => (prev === categoryIndex ? null : categoryIndex));
    setOpenItems({});
  };

  const toggleItem = (catIndex, qIndex) => {
    const key = `${catIndex}-${qIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getMaxHeight = (key) => {
    const el = itemRefs.current[key];
    return el ? `${el.scrollHeight}px` : "0px";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-white">
        Loading FAQs…
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <div className="flex items-center justify-center mb-6">
          <div className="h-1 w-10 sm:w-20 md:w-24 bg-[linear-gradient(to_right,#C7A15C,#FFE6A0,#FFD27F,transparent)]"></div>

          <div className="relative mx-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[linear-gradient(to_bottom_right,#FFD97F,#FFE6A0)] flex items-center justify-center shadow-lg shadow-[#FFD97F]/30 rounded-lg">
              <Pyramid className="w-6 h-6 sm:w-7 sm:h-7 text-black" strokeWidth={1.5}/>
            </div>
            <Pyramid className="absolute top-0 left-0 w-12 h-12 sm:w-14 sm:h-14 opacity-30 blur-sm rounded-lg" strokeWidth={1.5}/>
          </div>

          <div className="h-1 w-10 sm:w-20 md:w-24 bg-[linear-gradient(to_left,#C7A15C,#FFE6A0,#FFD27F,transparent)] rotate-180"></div>
        </div>

        <h2 className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 drop-shadow-lg bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F] bg-clip-text text-transparent transition-all duration-300 ">
          Frequently Asked Questions
        </h2>

        <p className="text-sm sm:text-lg text-white max-w-3xl mx-auto px-2">
          Everything you need to know about your journey to the land of
          <span className="font-semibold bg-linear-to-r from-[#C7A15C] via-[#E2C784] to-[#C7A15C] bg-clip-text text-transparent"> PEACE.</span>
        </p>
      </div>

      <div className="max-w-4xl lg:max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {faqCategories.map((category, catIndex) => {
          const Icon = iconMap[category.icon] || Info;
          const isCategoryOpen = openCategory === catIndex;

          return (
            <div key={catIndex} className=" rounded-2xl shadow-2xl">
              <div
                className="px-4 py-3 sm:px-6 sm:py-4 border-4 rounded-2xl bg-linear-to-r from-[#B9934C] via-[#e8bd72] to-[#b58a3f] rounded-t-2xl border-amber-950 flex items-center justify-between cursor-pointer transition-colors duration-300 hover:bg-linear-to-r hover:from-[#d1a85b] hover:via-[#e0c083] hover:to-[#c4984f]"
                onClick={() => toggleCategory(catIndex)}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Icon size={24} className="text-amber-950 shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-amber-950 leading-tight">{category.title}</h3>
                    <span className="text-xs sm:text-sm text-white/90"> {isCategoryOpen ? "Click to collapse" : "Click to expand"}</span>
                  </div>
                </div>
                <ChevronDown className={`text-amber-950 transition-transform duration-400 shrink-0 ${isCategoryOpen ? "rotate-180" : ""}`}size={24}/>
              </div>

              <div
                ref={(el) => (itemRefs.current[`cat-${catIndex}`] = el)}
                className={`overflow-hidden transition-all ease-in-out duration-700 ${isCategoryOpen ? "opacity-100" : "opacity-0"}`}
                style={{maxHeight: isCategoryOpen ? "5000px" : "0px",transitionDuration: "800ms",}}>
                {category.questions.map((item, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;
                  const isOpen = openItems[key];

                  return (
                    <div key={key} className="overflow-hidden border-b last:border-b-0">
                      <button onClick={() => toggleItem(catIndex, qIndex)}
                        className="w-full text-left px-4 py-4 sm:px-6 sm:py-5 flex justify-between items-center transition-colors duration-300 text-white hover:bg-amber-900/30">
                        <span className="text-sm sm:text-lg font-medium leading-relaxed pr-4">{item.question}</span>
                        <ChevronDown className={` shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}size={22}/>
                      </button>

                      <div
                        ref={(el) => (itemRefs.current[key] = el)}
                        style={{maxHeight: openItems[key] ? getMaxHeight(key) : "0px",opacity: openItems[key] ? 1 : 0,}}
                        className="overflow-hidden transition-all duration-300 ease-in-out">
                        <div className="px-4 pb-4 sm:px-6 sm:pb-6 mt-2">
                          <p className="text-sm sm:text-base text-white/90 border-l-4 pl-3 sm:pl-4 border-amber-950">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;