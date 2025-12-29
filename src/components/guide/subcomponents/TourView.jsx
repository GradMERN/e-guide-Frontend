import { useState, useEffect } from "react";
import {FaPlay,FaPause,FaSpinner,FaLanguage,FaVolumeUp,} from "react-icons/fa";
import { speakText } from "../../../services/aiService";

const TourView = ({
  selectedItem,
  isDarkMode,
  safeT,
  audioRef,
  audioSrc,
  isPlaying,
  progress,
  currentTime,
  duration,
  setIsDragging,
  toggle,
  seekPercent,
  translatedScript,
  isTranslating,
  isRtl = false,
  selectedLanguage = "en",
  stopAudio,
}) => {
  const [isSpeakingTranslation, setIsSpeakingTranslation] = useState(false);
  const [ttsProgress, setTtsProgress] = useState(0);
  const progressIntervalRef = React.useRef(null);

  const useTTS = translatedScript && selectedLanguage && selectedLanguage !== "en";

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [selectedLanguage, translatedScript]);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setIsSpeakingTranslation(false);
    setTtsProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, [selectedItem?._id]);

  if (!selectedItem) return null;

  const img = selectedItem.mainImage?.url || selectedItem.image || "";

  const displayScript = translatedScript || selectedItem.script;

  const format = (sec) => sec ? new Date(sec * 1000).toISOString().substr(14, 5) : "00:00";

  const progressValue = useTTS ? ttsProgress : Math.max(0, Math.min(100, progress || 0));
  const progressStyle = isRtl ? { right: 0, width: `${progressValue}%` } : { left: 0, width: `${progressValue}%` };
  const knobPosition = isRtl ? { right: `${progressValue}%`, transform: "translate(50%, -50%)" } : { left: `${progressValue}%`, transform: "translate(-50%, -50%)" };

  const handleMainToggle = () => {
    if (useTTS) {
      if (audioRef?.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      if (isSpeakingTranslation) {
        window.speechSynthesis?.cancel();
        setIsSpeakingTranslation(false);
        setTtsProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      } else {
        const textToSpeak = translatedScript || selectedItem.script;
        if (!textToSpeak) return;

        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }

        setIsSpeakingTranslation(true);
        const words = textToSpeak.split(" ").length;
        const estimatedDuration = Math.max(words * 0.4, 2); // ~0.4 seconds per word, min 2 seconds
        let elapsed = 0;
        progressIntervalRef.current = setInterval(() => {
          elapsed += 0.1;
          const progress = Math.min(100, (elapsed / estimatedDuration) * 100);
          setTtsProgress(progress);
          if (progress >= 100) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        }, 100);

        speakText(textToSpeak, selectedLanguage, () => {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          setIsSpeakingTranslation(false);
          setTtsProgress(0);
        });
      }
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeakingTranslation(false);
      setTtsProgress(0);
      toggle();
    }
  };

  const handleSpeakTranslation = () => {
    if (isSpeakingTranslation) {
      window.speechSynthesis?.cancel();
      setIsSpeakingTranslation(false);
      return;
    }

    const textToSpeak = translatedScript || selectedItem.script;
    if (!textToSpeak) return;

    setIsSpeakingTranslation(true);
    speakText(textToSpeak, selectedLanguage || "en", () => {
      setIsSpeakingTranslation(false);
    });
  };

  const isCurrentlyPlaying = useTTS ? isSpeakingTranslation : isPlaying;
  
  return (
    <div className="rounded-xl md:rounded-2xl overflow-hidden border shadow-xl"
      style={{ background: "var(--surface)", borderColor: "var(--border)",}}>
      <div className="relative">
        {img ? (
          <>
            <img src={img} alt={selectedItem.title || selectedItem.name} className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"/>

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center">
              <button onClick={handleMainToggle} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                style={{ background: useTTS && isSpeakingTranslation ? "linear-gradient(135deg, #22c55e, #16a34a)" : "var(--button-primary-bg)", color: "var(--button-primary-text)", border: "3px solid rgba(255, 255, 255, 0.3)", backdropFilter: "blur(10px)",}}aria-label={isCurrentlyPlaying ? "Pause" : "Play"}>
                {isCurrentlyPlaying ? (
                  <FaPause className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                ) : (
                  <FaPlay className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ml-1" />
                )}
              </button>
              
              {useTTS && (
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <FaLanguage className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span className="font-medium">
                    {safeT("guide.ai.translatedAudio", "Translated Audio")}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={`${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-200"} w-full h-48 sm:h-64 md:h-80 flex items-center justify-center`}>
            <div className="text-center">
              <div className={`${ isDarkMode ? "bg-[#3a2516]" : "bg-gray-300"} w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                <span className="text-xl sm:text-2xl">▶</span>
              </div>
              <p className={`text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {safeT("guide.noImage", "No Image")}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={`px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 ${isDarkMode ? "bg-[#1a0f08]/50" : "bg-gray-50"} border-b`} style={{ borderColor: "var(--border)" }}>
        <div className={`flex items-center gap-3 sm:gap-4 md:gap-5 ${ isRtl ? "flex-row-reverse" : ""}`}>
          <button
            onClick={handleMainToggle}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background:
                useTTS && isSpeakingTranslation
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
              color: "var(--button-primary-text)",
              border: useTTS
                ? "2px solid rgba(34, 197, 94, 0.5)"
                : "2px solid rgba(213, 179, 106, 0.3)",
              boxShadow: isCurrentlyPlaying
                ? useTTS
                  ? "0 0 20px rgba(34, 197, 94, 0.4), inset 0 0 20px rgba(255,255,255,0.1)"
                  : "0 0 20px rgba(213, 179, 106, 0.4), inset 0 0 20px rgba(255,255,255,0.1)"
                : "0 4px 15px rgba(0,0,0,0.3)",
            }}
            aria-label={isCurrentlyPlaying ? "Pause audio" : "Play audio"}>
            {isCurrentlyPlaying ? (
              <FaPause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            ) : (
              <FaPlay className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isRtl ? "mr-0.5" : "ml-0.5"}`} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className={`flex items-center justify-between text-xs sm:text-sm md:text-base font-medium mb-1.5 sm:mb-2 ${ isRtl ? "flex-row-reverse" : ""}`}>
              <span className={`${isDarkMode ? "text-[#D5B36A]" : "text-amber-600"} font-semibold`}>
                {useTTS ? safeT("guide.ai.tts", "TTS") : format(currentTime)}
              </span>
              <span style={{ color: "var(--text-muted)" }} className="text-xs sm:text-sm">
                {useTTS
                  ? isSpeakingTranslation
                    ? safeT("guide.ai.playing", "Playing...")
                    : safeT("guide.ai.ready", "Ready")
                  : duration ? format(duration) : "--:--"}
              </span>
            </div>

            <div className={`relative w-full h-1.5 sm:h-2 md:h-2.5 rounded-full cursor-pointer group ${ isDarkMode ? "bg-gray-700/50" : "bg-gray-300"}`} style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",}} onMouseDown={(e) => { setIsDragging(true); const r = e.currentTarget.getBoundingClientRect(); let pct = ((e.clientX - r.left) / r.width) * 100; if (isRtl) {pct = 100 - pct;}seekPercent(pct);}}>
              <div className="absolute inset-y-0 overflow-hidden rounded-full transition-all duration-150" style={progressStyle}>
                <div className="h-full w-full" style={{ background: isRtl ? "linear-gradient(270deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))" : "linear-gradient(90deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))", boxShadow: "0 0 10px rgba(213, 179, 106, 0.4)",}}/>
              </div>

              <div className="absolute top-1/2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-white shadow-lg transition-all duration-150 group-hover:scale-125"style={{...knobPosition, boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px rgba(213, 179, 106, 0.5)",}}/>
            </div>

            {isPlaying && (
              <div className={`flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 ${ isRtl ? "justify-end" : "justify-start"}`}>
                <FaVolumeUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#D5B36A] animate-pulse" />
                <span className={`text-xs sm:text-sm font-medium ${ isDarkMode ? "text-[#D5B36A]" : "text-amber-600"}`}>
                  {safeT("guide.ai.playing", "Playing...")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
        <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {selectedItem.title || selectedItem.name}
        </h2>

        <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${ isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          {selectedItem.description || selectedItem.shortDescription || ""}
        </p>

        {selectedItem.script && (
          <div className={`rounded-xl p-4 sm:p-5 md:p-6 ${ isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} border`} style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2 sm:gap-3">
              <h3 className={`text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2 ${ isDarkMode ? "text-white" : "text-gray-900"}`}>
                <span className="w-1 h-5 sm:h-6 bg-linear-to-b from-[#C7A15C] to-[#E2C784] rounded-full" />
                {safeT("guide.script", "Script")}
              </h3>
              
              <div className="flex items-center gap-2">
                {isTranslating && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D5B36A]/10 border border-[#D5B36A]/30">
                    <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-[#D5B36A]" />
                    <span className="text-xs sm:text-sm font-medium text-[#D5B36A]">
                      {safeT("guide.translation.translating", "Translating...")}
                    </span>
                  </div>
                )}
                {translatedScript && !isTranslating && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                    <FaLanguage className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span className="text-xs sm:text-sm font-medium text-green-500">
                      {safeT("guide.translation.translated", "Translated")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <p className={`whitespace-pre-wrap leading-relaxed text-sm sm:text-base md:text-lg ${ isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {displayScript}
            </p>
          </div>
        )}

        <audio ref={audioRef} src={audioSrc} preload="metadata" crossOrigin="anonymous" className="hidden"/>
      </div>
    </div>
  );
};

export default TourView;