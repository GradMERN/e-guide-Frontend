export default function TitlesHome({ icon: Icon, title, paragraph }) {
  return (
    <div className="text-center mb-10 sm:mb-12 lg:mb-16">
      <div className="flex items-center justify-center mb-6">
        <div className="h-1 w-10 sm:w-20 md:w-24 bg-[linear-gradient(to_right,#C7A15C,#FFE6A0,#FFD27F,transparent)]"></div>

        <div className="relative mx-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[linear-gradient(to_bottom_right,#FFD97F,#FFE6A0)] flex items-center justify-center shadow-lg shadow-[#FFD97F]/30 rounded-lg">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
          </div>

          <div className="absolute top-0 left-0 w-12 h-12 sm:w-14 sm:h-14 opacity-30 blur-sm text-[#FFD97F] flex items-center justify-center pointer-events-none">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        <div className="h-1 w-10 sm:w-20 md:w-24 bg-[linear-gradient(to_left,#C7A15C,#FFE6A0,#FFD27F,transparent)] rotate-180"></div>
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 drop-shadow-lg bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F] bg-clip-text text-transparent transition-all duration-300">
        {title}
      </h2>

      <p className="text-sm sm:text-lg text-white max-w-3xl mx-auto px-2">
        {paragraph}
      </p>
    </div>
  );
}
