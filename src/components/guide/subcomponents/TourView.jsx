import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaSpinner,
  FaLanguage,
  FaVolumeUp,
  FaStop,
} from "react-icons/fa";
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

  // Determine if we should use TTS (when translation is active)
  const useTTS = translatedScript && selectedLanguage;

  if (!selectedItem) return null;

  const img = selectedItem.mainImage?.url || selectedItem.image || "";

  // Use translated script if available, otherwise original
  const displayScript = translatedScript || selectedItem.script;

  const format = (sec) =>
    sec ? new Date(sec * 1000).toISOString().substr(14, 5) : "00:00";

  // Calculate progress based on RTL direction
  const progressValue = useTTS
    ? ttsProgress
    : Math.max(0, Math.min(100, progress || 0));
  const progressStyle = isRtl
    ? { right: 0, width: `${progressValue}%` }
    : { left: 0, width: `${progressValue}%` };
  const knobPosition = isRtl
    ? { right: `${progressValue}%`, transform: "translate(50%, -50%)" }
    : { left: `${progressValue}%`, transform: "translate(-50%, -50%)" };

  // Main toggle handler - plays TTS if translation is active, otherwise normal audio
  const handleMainToggle = () => {
    if (useTTS) {
      // Stop regular audio first
      if (audioRef?.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Use TTS for translated content
      if (isSpeakingTranslation) {
        window.speechSynthesis?.cancel();
        setIsSpeakingTranslation(false);
        setTtsProgress(0);
      } else {
        const textToSpeak = translatedScript || selectedItem.script;
        if (!textToSpeak) return;

        setIsSpeakingTranslation(true);
        // Simulate progress for TTS
        const words = textToSpeak.split(" ").length;
        const estimatedDuration = words * 0.4; // ~0.4 seconds per word
        let elapsed = 0;
        const interval = setInterval(() => {
          elapsed += 0.1;
          const progress = Math.min(100, (elapsed / estimatedDuration) * 100);
          setTtsProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 100);

        speakText(textToSpeak, selectedLanguage, () => {
          clearInterval(interval);
          setIsSpeakingTranslation(false);
          setTtsProgress(0);
        });
      }
    } else {
      // Stop TTS first
      window.speechSynthesis?.cancel();
      setIsSpeakingTranslation(false);
      setTtsProgress(0);
      // Use original audio toggle
      toggle();
    }
  };

  // Handle speaking the translated text (secondary button)
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

  // Determine current playing state
  const isCurrentlyPlaying = useTTS ? isSpeakingTranslation : isPlaying;
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="relative">
        {img ? (
          <>
            <img
              src={img}
              alt={selectedItem.title || selectedItem.name}
              className="w-full h-80 object-cover"
            />

            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={handleMainToggle}
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-110"
                style={{
                  background:
                    useTTS && isSpeakingTranslation
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : "var(--button-primary-bg)",
                  color: "var(--button-primary-text)",
                  border: "none",
                }}
              >
                {isCurrentlyPlaying ? (
                  <FaPause className="w-7 h-7" />
                ) : (
                  <FaPlay className="w-7 h-7" />
                )}
              </button>
              {/* Show indicator when using TTS */}
              {useTTS && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
                  <FaLanguage className="w-3 h-3" />
                  <span>
                    {safeT("guide.ai.translatedAudio", "Translated Audio")}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            className={`${
              isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-200"
            } w-full h-80 flex items-center justify-center`}
          >
            <div className="text-center">
              <div
                className={`${
                  isDarkMode ? "bg-[#3a2516]" : "bg-gray-300"
                } w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                ▶
              </div>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                {safeT("guide.noImage", "No Image")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modern Audio Player with RTL Support */}
      <div
        className={`px-6 py-5 ${isDarkMode ? "bg-[#1a0f08]/50" : "bg-gray-50"}`}
      >
        <div
          className={`flex items-center gap-4 ${
            isRtl ? "flex-row-reverse" : ""
          }`}
        >
          {/* Play/Pause Button */}
          <button
            onClick={handleMainToggle}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-all duration-300 hover:scale-105 active:scale-95"
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
          >
            {isCurrentlyPlaying ? (
              <FaPause className="w-5 h-5" />
            ) : (
              <FaPlay className={`w-5 h-5 ${isRtl ? "mr-0.5" : "ml-0.5"}`} />
            )}
          </button>

          {/* Progress Section */}
          <div className="flex-1">
            {/* Time Display Above Progress Bar */}
            <div
              className={`flex items-center justify-between text-sm font-medium mb-2 ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              <span
                className={`${
                  isDarkMode ? "text-[#D5B36A]" : "text-amber-600"
                }`}
              >
                {useTTS ? safeT("guide.ai.tts", "TTS") : format(currentTime)}
              </span>
              <span style={{ color: "var(--text-muted)" }}>
                {useTTS
                  ? isSpeakingTranslation
                    ? safeT("guide.ai.playing", "Playing...")
                    : safeT("guide.ai.ready", "Ready")
                  : duration
                  ? format(duration)
                  : "--:--"}
              </span>
            </div>

            {/* Progress Bar */}
            <div
              className={`relative w-full h-2 rounded-full cursor-pointer group ${
                isDarkMode ? "bg-gray-700/50" : "bg-gray-300"
              }`}
              style={{
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
              }}
              onMouseDown={(e) => {
                setIsDragging(true);
                const r = e.currentTarget.getBoundingClientRect();
                let pct = ((e.clientX - r.left) / r.width) * 100;
                // Adjust for RTL
                if (isRtl) {
                  pct = 100 - pct;
                }
                seekPercent(pct);
              }}
            >
              {/* Progress Fill */}
              <div
                className="absolute inset-y-0 overflow-hidden rounded-full"
                style={progressStyle}
              >
                <div
                  className="h-full w-full"
                  style={{
                    background: isRtl
                      ? "linear-gradient(270deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))"
                      : "linear-gradient(90deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))",
                    boxShadow: "0 0 10px rgba(213, 179, 106, 0.3)",
                  }}
                />
              </div>

              {/* Knob/Thumb */}
              <div
                className="absolute top-1/2 w-4 h-4 rounded-full bg-white shadow-lg transition-transform duration-150 group-hover:scale-125"
                style={{
                  ...knobPosition,
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px rgba(213, 179, 106, 0.5)",
                }}
              />
            </div>

            {/* Audio Waveform Indicator (Visual Enhancement) */}
            {isPlaying && (
              <div
                className={`flex items-center gap-0.5 mt-2 ${
                  isRtl ? "justify-end" : "justify-start"
                }`}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#D5B36A] rounded-full animate-pulse"
                    style={{
                      height: `${8 + Math.random() * 12}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: "0.5s",
                    }}
                  />
                ))}
                <FaVolumeUp
                  className={`w-3 h-3 text-[#D5B36A] ${
                    isRtl ? "mr-2" : "ml-2"
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h2
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {selectedItem.title || selectedItem.name}
        </h2>

        <p
          className={`leading-relaxed ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {selectedItem.description || selectedItem.shortDescription || ""}
        </p>

        {selectedItem.script && (
          <div
            className={`rounded-lg p-4 ${
              isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {safeT("guide.script", "Script")}
              </h3>
              <div className="flex items-center gap-2">
                {isTranslating && (
                  <div className="flex items-center gap-2 text-[#D5B36A]">
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span className="text-sm">
                      {safeT("guide.translation.translating", "Translating...")}
                    </span>
                  </div>
                )}
                {translatedScript && !isTranslating && (
                  <div className="flex items-center gap-2 text-green-500">
                    <FaLanguage className="w-4 h-4" />
                    <span className="text-sm">
                      {safeT("guide.translation.translated", "Translated")}
                    </span>
                  </div>
                )}
                {/* Listen to Script/Translation Button */}
                <button
                  onClick={handleSpeakTranslation}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isSpeakingTranslation
                      ? "bg-green-500 text-white"
                      : isDarkMode
                      ? "bg-[#3c2820] text-[#D5B36A] hover:bg-[#4c3830] border border-[#D5B36A]/30"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300"
                  }`}
                  title={safeT("guide.ai.listenToScript", "Listen to script")}
                >
                  {isSpeakingTranslation ? (
                    <>
                      <FaStop className="w-3 h-3" />
                      <span>{safeT("guide.ai.stopSpeaking", "Stop")}</span>
                    </>
                  ) : (
                    <>
                      <FaVolumeUp className="w-3 h-3" />
                      <span>{safeT("guide.ai.listen", "Listen")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <p
              className={`whitespace-pre-wrap leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {displayScript}
            </p>
          </div>
        )}

        <audio
          ref={audioRef}
          src={audioSrc}
          preload="metadata"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};

export default TourView;
