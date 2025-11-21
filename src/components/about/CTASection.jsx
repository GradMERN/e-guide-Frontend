import { ArrowRight } from "lucide-react";
export default function CTASection() {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
        <div className="fade-up glass-effect p-8 sm:p-12 lg:p-20 rounded-3xl gradient-border">
          <span className="inline-block text-xs sm:text-sm tracking-[0.25em] text-[#E2C784] uppercase font-medium mb-4 sm:mb-6 smooth-text">
            Your Adventure Awaits
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-light mb-6 sm:mb-8 leading-snug sm:leading-tight smooth-text">
            Ready to Walk Among <br />
            <span className="font-semibold bg-linear-to-r from-[#C7A15C] via-[#E2C784] to-[#C7A15C] bg-clip-text text-transparent">
              The Pharaohs?
            </span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed smooth-text">
            Join over 50,000 travelers who've discovered the wonders of ancient
            Egypt through our expertly curated journeys
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-linear-to-r from-[#C7A15C] to-[#E2C784] text-[#0f0b08] font-bold rounded-full hover:from-[#E2C784] hover:to-[#FFD27F] transition-all duration-500 shadow-2xl hover:shadow-[#E2C784]/50 transform hover:scale-105 text-sm sm:text-base">
              <span>Book Your Expedition</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <button className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 border-2 border-[#C7A15C]/30 text-[#E2C784] font-semibold rounded-full hover:border-[#E2C784] hover:bg-[#C7A15C]/10 transition-all duration-500 backdrop-blur-sm text-sm sm:text-base">
              <span>View Tours</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
