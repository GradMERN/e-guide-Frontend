import { useEffect, useRef, useState } from "react";

export default function useAudioPlayer(src) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // percent
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let mounted = true;
    let cleanup = null;

    const attach = () => {
      const audio = audioRef.current;
      if (!audio || !mounted) return false;

      const onTime = () => {
        if (!isDragging && audio.duration) {
          setCurrentTime(audio.currentTime || 0);
          setProgress(((audio.currentTime || 0) / audio.duration) * 100);
        }
      };
      const onLoaded = () => {
        setDuration(audio.duration || 0);
      };
      const onEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      };

      audio.addEventListener("timeupdate", onTime);
      audio.addEventListener("loadedmetadata", onLoaded);
      audio.addEventListener("ended", onEnded);

      cleanup = () => {
        try {
          audio.removeEventListener("timeupdate", onTime);
          audio.removeEventListener("loadedmetadata", onLoaded);
          audio.removeEventListener("ended", onEnded);
        } catch (e) {}
      };
      return true;
    };

    // Try to attach immediately; if audio element isn't ready yet, poll for it
    // for a short period so listeners are attached reliably after navigation/reload.
    if (!attach()) {
      const start = Date.now();
      const interval = setInterval(() => {
        if (attach()) {
          clearInterval(interval);
          return;
        }
        if (Date.now() - start > 2000) {
          clearInterval(interval);
        }
      }, 50);
      cleanup = () => clearInterval(interval);
    }

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
    // re-run when src or dragging state changes so listeners/readers are fresh
  }, [isDragging, src]);

  useEffect(() => {
    // When src changes, reset state
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.pause();
      } catch (e) {}
    }
  }, [src]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const seekPercent = (pct) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;
    const clamped = Math.max(0, Math.min(100, pct));
    audio.currentTime = (clamped / 100) * audio.duration;
    setProgress(clamped);
    setCurrentTime(audio.currentTime || 0);
  };

  // drag helpers
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return;
      // delegated: consumer should call seekPercent by measuring bar
    };
    const onUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (audioRef.current) audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  return {
    audioRef,
    isPlaying,
    progress,
    currentTime,
    duration,
    isDragging,
    setIsDragging,
    toggle,
    seekPercent,
  };
}
