export default function CTASection() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Main CTA Card */}
        <div className="bg-linear-to-br from-[#C7A15C] to-[#E2C784] p-12 sm:p-16 rounded-3xl shadow-2xl">
          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black text-[#1B1A17] mb-6 drop-shadow-md">
            Ready to Explore Egypt?
          </h2>

          <p className="text-black mb-8 max-w-2xl mx-auto text-sm sm:text-base drop-shadow-sm">
            Join thousands of travelers who've experienced the magic of ancient
            Egypt with us
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#1B1A17] font-bold rounded-full shadow-lg 
              hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              Book a Tour Now
            </button>

            <button
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-[#1B1A17] font-bold rounded-full shadow-lg
              hover:bg-white hover:text-[#C7A15C] hover:shadow-xl transition-colors duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}