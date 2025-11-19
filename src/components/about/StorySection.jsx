import { CheckCircle } from "lucide-react";
import photo30 from "../../assets/images/photo-30.webp";

export default function StorySection() {
  const features = [
    "Expert Local Guides",
    "Authentic Experiences",
    "Sustainable Tourism",
    "Small Group Tours",
  ];

  return (
    <section className="py-20 bg-linear-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img src={photo30} className="w-full h-96 object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-linear-to-br from-[#C7A15C] to-[#E2C784] rounded-2xl -z-10"></div>
        </div>

        <div>
          <h2 className="text-5xl font-black text-white mb-6">Our Story</h2>

          <p className="text-gray-300 mb-6">
            Founded in 2025, we've been sharing Egypt's heritage with travelers
            worldwide.
          </p>

          <p className="text-gray-300 mb-8">
            Expert Egyptologists, local guides, and sustainable tourism
            practices ensure an unforgettable journey.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-linear-to-br from-[#C7A15C] to-[#E2C784] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
                <span className="text-white font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}