export default function TitlesHome({ icon: Icon, title, paragraph }) {
  return (
    <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2 sm:px-4">
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <div className="h-0.5 w-16 sm:w-32 md:w-48 bg-[linear-gradient(to_right,#C7A15C,#FFE6A0,#FFD27F,transparent)]"></div>

        <div className="relative mx-2 sm:mx-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[linear-gradient(to_bottom_right,#FFD97F,#FFE6A0)] flex items-center justify-center shadow-lg shadow-[#FFD97F]/30 rounded-lg">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </div>

          <div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 opacity-30 blur-sm text-[#FFD97F] flex items-center justify-center pointer-events-none">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="h-0.5 w-16 sm:w-32 md:w-48 bg-[linear-gradient(to_right,#C7A15C,#FFE6A0,#FFD27F,transparent)]"></div>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F] bg-clip-text text-transparent leading-snug sm:leading-snug md:leading-snug">
        {title}
      </h2>

      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white max-w-3xl mx-auto">
        {paragraph}
      </p>
    </div>
  );
};