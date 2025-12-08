import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";

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
}) => {
  if (!selectedItem) return null;

  const img = selectedItem.mainImage?.url || selectedItem.image || "";

  const format = (sec) =>
    sec ? new Date(sec * 1000).toISOString().substr(14, 5) : "00:00";

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
                onClick={toggle}
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-110"
                style={{
                  background: "var(--button-primary-bg)",
                  color: "var(--button-primary-text)",
                  border: "none",
                }}
              >
                {isPlaying ? (
                  <FaPause className="w-7 h-7" />
                ) : (
                  <FaPlay className="w-7 h-7" />
                )}
              </button>
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

      <div className="px-6 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md shrink-0"
            style={{
              background: "var(--button-primary-bg)",
              color: "var(--button-primary-text)",
              border: "none",
            }}
          >
            {isPlaying ? (
              <FaPause className="w-5 h-5" />
            ) : (
              <FaPlay className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1">
            <div
              className={`relative w-full h-3 rounded-full cursor-pointer ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
              style={{ marginTop: "6px" }}
              onMouseDown={(e) => {
                setIsDragging(true);
                const r = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - r.left) / r.width) * 100;
                seekPercent(pct);
              }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${Math.max(0, Math.min(100, progress || 0))}%`,
                    background:
                      "linear-gradient(90deg,var(--gradient-from),var(--gradient-via),var(--gradient-to))",
                  }}
                />
              </div>

              <div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-white shadow-lg"
                style={{
                  left: `${Math.max(0, Math.min(100, progress || 0))}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>

            <div
              className="mt-2 flex items-center justify-between text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span>{format(currentTime)}</span>
              <span>{duration ? format(duration) : "--:--"}</span>
            </div>
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
            <h3
              className={`text-lg font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {safeT("guide.script", "Script")}
            </h3>
            <p
              className={`whitespace-pre-wrap leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {selectedItem.script}
            </p>
          </div>
        )}

        <audio
          ref={audioRef}
          src={
            selectedItem.audioUrl ||
            selectedItem.audio?.url ||
            selectedItem.audioFile ||
            selectedItem.media?.audio ||
            ""
          }
        />
      </div>
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
};

export default TourView;
