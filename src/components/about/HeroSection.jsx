import photo31 from "../../assets/images/photo-31.jpeg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-start justify-center overflow-hidden bg-linear-to-br from-[#7B3F00] via-[#A36B2C] to-[#7B3F00]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${photo31})` }}
      ></div>

      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/80"></div>

      <div className="relative z-10 text-center px-6 pt-24 sm:pt-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
          About Us
        </h1>
        <p className="text-lg md:text-xl text-gray-200">
          Founded in 2025, we share Egypt's rich heritage with travelers
          worldwide. Our expert local guides and sustainable tourism practices
          ensure an unforgettable experience.
        </p>
      </div>
    </section>
  );
}
