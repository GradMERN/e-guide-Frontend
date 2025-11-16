export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-white">
      <img
        src="./src/assets/images/hero.png"
        alt="Egypt Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/75"></div>

      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          <span className="text-[#D5B36A]">
            Discover the Mysteries of Ancient Egypt
          </span>
        </h1>

        <p className="mt-4 text-lg md:text-md text-gray-200">
          Experience personalized tours guided by Egyptologists through the land
          of pharaohs
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/tours"
            className="px-6 py-3 rounded-full text-black font-semibold
                       bg-linear-to-r from-[#C7A15C] to-[#E2C784]
                       hover:from-[#B8924F] hover:to-[#DCC07C]
                       shadow-lg transition"
          >
            Explore Tours
          </a>

          <a
            href="/contact"
            className="px-6 py-3 rounded-full border border-[#D5B36A]
                       text-[#D5B36A] hover:bg-[#D5B36A] hover:text-black hover:font-semibold
                       transition shadow-md"
          >
            Plan your trip
          </a>
        </div>
      </div>
    </section>
  );
}
