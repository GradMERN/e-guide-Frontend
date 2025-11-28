import { useState, useEffect } from "react";
import { BsQuestionSquare } from "react-icons/bs";
import {FaInfoCircle,FaLandmark,FaMobileAlt,FaUser,FaMapMarkerAlt,FaGlobe,} from "react-icons/fa";
import FAQGlobal from "../common/FAQGlobal";
import TitlesHome from "../common/TitlesHome";


const FAQSection = () => {
  const [faqCategories, setFaqCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    info: FaInfoCircle,
    pyramid: BsQuestionSquare,
    landmark: FaLandmark,
    smartphone: FaMobileAlt,
    user: FaUser,
    mapPin: FaMapMarkerAlt,
    globe: FaGlobe,
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
        const dataWithIcons = getSampleData().map((cat) => ({
          ...cat,icon: iconMap[cat.icon] || BsQuestionSquare,
        }));
        setFaqCategories(dataWithIcons);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-white">
        Loading FAQs…
      </div>
    );
  }

  return (
    <section className="min-h-screen py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-10 lg:px-14 mb-12 md:mb-20">
      <TitlesHome
        icon={BsQuestionSquare}
        title="Frequently Asked Questions"
        paragraph={
          <>
            Everything you need to know about your journey to the land of
            <span className="font-semibold bg-linear-to-r from-[#C7A15C] via-[#E2C784] to-[#C7A15C] bg-clip-text text-transparent"> PEACE.</span>
          </>
        }
      />
      <FAQGlobal categories={faqCategories} />
    </section>
  );
};

export default FAQSection;