import { useState, useEffect, useRef } from "react";
import {Pyramid,ChevronDown,Info,Landmark,CreditCard,Smartphone,Headphones,User,Shield,MapPin,Camera,Globe,Star,Settings,Gift,} from "lucide-react";

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
    creditCard: CreditCard,
    smartphone: Smartphone,
    headphones: Headphones,
    user: User,
    shield: Shield,
    mapPin: MapPin,
    camera: Camera,
    globe: Globe,
    star: Star,
    settings: Settings,
    gift: Gift,
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
        {
          question: "Is E-Tour Guide available in multiple languages?",
          answer:
            "Yes! E-Tour Guide supports multiple languages including English, Arabic, French, German, Spanish, Italian, Chinese, Japanese, and Russian. Switch languages anytime in your profile settings.",
          order: 3,
        },
        {
          question: "Can I use E-Tour Guide offline?",
          answer:
            "Currently, you need an internet connection to browse tours. However, our upcoming Progressive Web App (PWA) will enable offline access to downloaded tours and guides in the future.",
          order: 4,
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
          question: "What are the AR and VR features?",
          answer:
            "Our augmented reality features bring ancient Egypt to life! Point your phone at temples to see reconstructions, view pharaohs in their original glory, and explore tombs with interactive overlays. VR tours let you explore sites before visiting.",
          order: 4,
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
      title: "Booking & Payments",
      icon: "creditCard",
      borderColor: "border-orange-500",
      order: 3,
      questions: [
        {
          question: "How do I book a tour through E-Tour Guide?",
          answer:
            "Browse available tours, select your preferred date and time, choose the number of participants, and proceed to checkout. You'll receive instant confirmation via email with your e-ticket and meeting point details.",
          order: 1,
        },
        {
          question: "What payment methods are accepted?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. Payments are processed securely with 256-bit encryption.",
          order: 2,
        },
        {
          question: "What is your cancellation policy?",
          answer:
            "Free cancellation up to 48 hours before your tour for a full refund. Cancellations within 24-48 hours receive a 50% refund. No refunds for cancellations within 24 hours. Emergency cancellations are reviewed case-by-case.",
          order: 3,
        },
        {
          question: "Can I modify my booking after confirmation?",
          answer:
            "Yes! Log into your account, go to 'My Bookings,' and select 'Modify.' Changes to dates, times, or group size (subject to availability) can be made up to 24 hours before your tour.",
          order: 4,
        },
        {
          question: "Do you offer group discounts?",
          answer:
            "Yes! Groups of 10 or more receive automatic discounts. For corporate groups or educational institutions, contact our team for custom pricing. Family packages are also available for groups traveling together.",
          order: 5,
        },
        {
          question: "Is travel insurance included in the booking?",
          answer:
            "Travel insurance is optional and can be added during checkout. We partner with leading insurance providers to offer comprehensive coverage including trip cancellation, medical emergencies, and lost luggage.",
          order: 6,
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
            "E-Tour Guide works on all modern browsers including Chrome, Safari, Firefox, and Edge. For the best experience, we recommend using the latest version of your preferred browser on both desktop and mobile devices.",
          order: 4,
        },
      ],
    },
    {
      title: "Support & Assistance",
      icon: "headphones",
      borderColor: "border-emerald-500",
      order: 5,
      questions: [
        {
          question: "How can I contact E-Tour Guide support?",
          answer:
            "Reach us via 24/7 live chat on our website, email at support@etourguide.com, phone at +20 123 456 7890, or WhatsApp. Our multilingual support team typically responds within 15 minutes.",
          order: 1,
        },
        {
          question: "What if I encounter issues during my tour?",
          answer:
            "Contact our emergency hotline immediately through our website or call our 24/7 support line. We'll assist with guide issues, site closures, emergencies, or any problems. Our local team is always available to help.",
          order: 2,
        },
        {
          question: "Do you offer travel insurance?",
          answer:
            "We partner with leading travel insurance providers. Add comprehensive coverage during checkout that includes trip cancellation, medical emergencies, lost luggage, and activity coverage.",
          order: 3,
        },
        {
          question: "Can tour guides accommodate special requirements?",
          answer:
            "Absolutely! Indicate any accessibility needs, dietary restrictions, medical conditions, or special requests when booking. We'll match you with appropriate guides and arrange necessary accommodations.",
          order: 4,
        },
        {
          question: "What languages do your support team speak?",
          answer:
            "Our support team speaks English, Arabic, French, German, Spanish, Italian, Chinese, Japanese, and Russian. You can communicate in your preferred language via chat, email, or phone.",
          order: 5,
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
      title: "Safety & Security",
      icon: "shield",
      borderColor: "border-rose-500",
      order: 7,
      questions: [
        {
          question: "Is Egypt safe for tourists?",
          answer:
            "Egypt is generally safe for tourists, especially in major tourist areas with visible security presence. Follow common travel safety practices, stay aware of your surroundings, and respect local customs. All our tours follow strict safety protocols.",
          order: 1,
        },
        {
          question: "How is my payment information protected?",
          answer:
            "We use industry-standard 256-bit SSL encryption for all transactions. Payment data is processed through PCI-DSS compliant payment gateways. We never store your complete credit card information on our servers.",
          order: 2,
        },
        {
          question: "Are tour guides verified?",
          answer:
            "Yes! All our tour guides are licensed, background-checked, and highly rated. They undergo regular training and must maintain high customer satisfaction scores. You can view guide profiles and ratings before booking.",
          order: 3,
        },
        {
          question: "What COVID-19 safety measures are in place?",
          answer:
            "We follow all local health guidelines and WHO recommendations. Tours include sanitization protocols, social distancing options, and small group sizes. Guides carry sanitizers and masks. Check individual tour listings for specific measures.",
          order: 4,
        },
        {
          question: "Is my personal data secure?",
          answer:
            "We take data privacy seriously and comply with GDPR and international data protection standards. Your information is encrypted, never sold to third parties, and only used to enhance your tour experience. View our Privacy Policy for details.",
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
          question: "Do you offer Nile cruise packages?",
          answer:
            "Yes! We partner with luxury Nile cruise operators offering 3-7 day journeys between Luxor and Aswan. Packages include all meals, guided tours at historic sites, and onboard entertainment. Browse our Nile Cruise section for options.",
          order: 4,
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
      title: "Technical Support",
      icon: "settings",
      order: 11,
      questions: [
        {
          question: "I forgot my password. How do I reset it?",
          answer:
            "Click 'Forgot Password' on the login page, enter your email, and we'll send a reset link. Check your spam folder if you don't see it. The link expires in 24 hours. For security, you'll need to create a new password.",
          order: 1,
        },
        {
          question: "Why isn't my payment going through?",
          answer:
            "Common issues include incorrect card details, insufficient funds, or international transaction blocks. Verify your information, ensure your bank allows international payments, or try a different payment method. Contact support if issues persist.",
          order: 2,
        },
        {
          question: "How do I update my account information?",
          answer:
            "Log into your account, click your profile icon, and select 'Settings.' Update your name, email, phone, password, and preferences. Don't forget to save changes. Email updates require verification for security.",
          order: 3,
        },
        {
          question: "Can I delete my account?",
          answer:
            "Yes. Go to Settings > Privacy > Delete Account. This permanently removes your data within 30 days per GDPR compliance. Active bookings must be cancelled first. You can also request account deactivation to preserve booking history.",
          order: 4,
        },
        {
          question: "Why am I not receiving booking confirmations?",
          answer:
            "Check your spam/junk folder first. Add support@etourguide.com to your contacts. Verify the email address in your account settings is correct. If issues continue, contact support for manual confirmation resend.",
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
        {
          question: "Is tipping expected in Egypt?",
          answer:
            "Yes, tipping (baksheesh) is customary. Guides expect 50-100 EGP per day, drivers 20-50 EGP, restaurant servers 10-15%, hotel staff 10-20 EGP. Keep small bills handy. Tipping is part of service culture and appreciated.",
          order: 5,
        },
        {
          question: "Can I drink tap water in Egypt?",
          answer:
            "It's recommended to drink only bottled water. Avoid ice cubes and use bottled water for brushing teeth. Bottled water is inexpensive and available everywhere. Most hotels provide complimentary bottles daily.",
          order: 6,
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch("/api/faqs");
        if (!response.ok) throw new Error();
        const data = await response.json();
        setFaqCategories(data);
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
      <div className="min-h-screen flex items-center justify-center">
        Loading FAQs…
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <div className="h-1 w-25 bg-[linear-gradient(to_right,#C7A15C,#FFE6A0,#FFD27F,transparent)]"></div>
          <div className="relative mx-4">
            <div className="w-14 h-14 bg-[linear-gradient(to_bottom_right,#FFD97F,#FFE6A0)] flex items-center justify-center shadow-lg shadow-[#FFD97F]/30">
              <Pyramid className="w-7 h-7 text-black" strokeWidth={1.5} />
            </div>
            <Pyramid className="absolute top-0 left-0 w-14 h-14 opacity-30 blur-sm" strokeWidth={1.5}/>
          </div>
          <div className="h-1 w-25 bg-[linear-gradient(to_right,#C7A15C,#FFE6A0,#FFD27F,transparent)]"></div>
        </div>

        <h2 className=" text-4xl md:text-5xl lg:text-6xl  mb-8 drop-shadow-lg bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F] bg-clip-text text-transparent transition-all duration-300 ">
          Frequently Asked Questions
        </h2>

        <p className="text-lg text-white max-w-2xl mx-auto">
          Everything you need to know about your journey to the land of{" "}
          <span className="font-semibold bg-linear-to-r from-[#C7A15C] via-[#E2C784] to-[#C7A15C] bg-clip-text text-transparent">
            PEACE.
          </span>
        </p>
      </div>

      <div
        className="max-w-6xl mx-auto space-y-8">
        {faqCategories.map((category, catIndex) => {
          const Icon = iconMap[category.icon] || Info;
          const isCategoryOpen = openCategory === catIndex;

          return (
            <div key={catIndex} className=" rounded-2xl shadow-xl">
              <div className="p-6 border-4 rounded-2xl bg-linear-to-r from-[#B9934C] via-[#e8bd72] to-[#b58a3f] rounded-t-2xl border-amber-950 flex items-center justify-between cursor-pointer"
                onClick={() => toggleCategory(catIndex)}>
                <div className="flex items-center gap-3">
                  <Icon size={28} className="text-amber-950" />
                  <div>
                    <h3 className="text-2xl font-bold text-amber-950">{category.title}</h3>
                    <span className="text-sm text-white"> {isCategoryOpen ? "Click to collapse" : "Click to expand"}</span>
                  </div>
                </div>
                <ChevronDown className={`text-amber-950 transition-transform duration-400 ${isCategoryOpen ? "rotate-180" : ""}`}size={26}/>
              </div>
              <div
                ref={(el) => (itemRefs.current[`cat-${catIndex}`] = el)}
                className={`overflow-hidden transition-all ease-in-out ${isCategoryOpen ? "opacity-100" : "opacity-0"}`}
                style={{ maxHeight: isCategoryOpen ? "5000px" : "0px",transitionDuration: "800ms"}}>

                {category.questions.map((item, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;
                  const isOpen = openItems[key];

                  return (
                    <div key={key} className="overflow-hidden rounded-2xl border border-amber-100">
                      <button
                        onClick={() => toggleItem(catIndex, qIndex)}
                        className="w-full text-left px-6 py-5 flex justify-between items-center transition-colors duration-500 bg-amber-950/0 hover:bg-amber-900 hover:text-white">
                        <span className="text-lg font-semibold">{item.question}</span>
                        <ChevronDown className={` shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}size={26}/>
                      </button>

                      <div
                        ref={(el) => (itemRefs.current[key] = el)}
                        style={{maxHeight: openItems[key] ? getMaxHeight(key) : "0px",opacity: openItems[key] ? 1 : 0,}}
                        className="overflow-hidden transition-all duration-500 ease-in-out">
                        <div className="px-6 pb-6 mt-2">
                          <p className="text-white border-l-4 pl-4"style={{ borderColor: "#C7A15C" }}>{item.answer}</p>
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
