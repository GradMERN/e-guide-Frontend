import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FaPlus,
  FaTimes,
  FaImage,
  FaMusic,
  FaSpinner,
  FaMapMarkerAlt,
  FaMicrophone,
  FaStop,
  FaVolumeUp,
  FaMagic,
  FaFileAudio,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { tourItemService } from "../../../apis/tourItemService";
import ConfirmModal from "../../common/ConfirmModal";
import {
  speakText,
  createSpeechRecognizer,
  SUPPORTED_LANGUAGES,
  generateAudioFromText,
  createVoiceRecorder,
  createLiveTranscriber,
  transcribeAudioFile,
} from "../../../services/aiService";

const defaultItemForm = () => ({
  title: "",
  location: { type: "Point", coordinates: [0, 0] },
  script: "",
  contentType: "informational",
  mainImage: null,
  mainImagePreview: null,
  galleryImages: [],
  audio: null,
  audioPreview: null,
  deletedGalleryImages: [],
  existingMainImage: null,
  existingGallery: [],
  existingAudio: null,
});

const getTourId = (tour) => (typeof tour === "string" ? tour : tour?._id);

const TourItemsManager = ({
  tour,
  onClose,
  isDarkMode,
  onUpdated,
  open = false,
  initialEditing = null,
  initialFormMode = "create",
}) => {
  const { t } = useTranslation();
  const safeT = (k, def) => t(k, { defaultValue: def });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultItemForm());
  const [taken, setTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null });

  // TTS/STT state
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLang, setSpeechLang] = useState("en");
  const recognizerRef = useRef(null);

  // Audio generation state
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const voiceRecorderRef = useRef(null);
  const liveTranscriberRef = useRef(null);

  const mainImageRef = useRef(null);
  const galleryRef = useRef(null);
  const audioRef = useRef(null);
  const pinRef = useRef(null);
  const sparkIntervalRef = useRef(null);

  const borderColor = "border-[var(--border)]";
  const inputBg = "bg-[var(--surface)]";
  const textColor = "text-[var(--text)]";
  const secondaryText = "text-[var(--text-secondary)]";
  const cardBg = "bg-[var(--surface)]";

  // TTS: Read script aloud
  const handleTextToSpeech = () => {
    if (!form.script?.trim()) {
      toast.warning(safeT("guide.ai.noTextToSpeak", "No text to speak"));
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speakText(form.script, speechLang, () => setIsSpeaking(false));
  };

  // STT: Voice-to-text for script
  const handleSpeechToText = () => {
    if (isRecording) {
      // Stop recording
      if (recognizerRef.current) {
        recognizerRef.current.stop();
        recognizerRef.current = null;
      }
      setIsRecording(false);
      return;
    }

    // Start recording
    try {
      const recognizer = createSpeechRecognizer(speechLang);
      if (!recognizer) {
        toast.error(
          safeT(
            "guide.ai.sttNotSupported",
            "Speech recognition is not supported in this browser"
          )
        );
        return;
      }

      recognizer.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setForm((prev) => ({
          ...prev,
          script: prev.script ? `${prev.script} ${transcript}` : transcript,
        }));
      };

      recognizer.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          toast.error(safeT("guide.ai.sttError", "Speech recognition failed"));
        }
        setIsRecording(false);
      };

      recognizer.onend = () => {
        setIsRecording(false);
        recognizerRef.current = null;
      };

      recognizerRef.current = recognizer;
      recognizer.start();
      setIsRecording(true);
      toast.info(safeT("guide.ai.listening", "Listening... Speak now"));
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      toast.error(
        safeT("guide.ai.sttError", "Failed to start speech recognition")
      );
    }
  };

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
        recognizerRef.current = null;
      }
      if (voiceRecorderRef.current) {
        voiceRecorderRef.current.stop();
        voiceRecorderRef.current = null;
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Generate audio from script - plays TTS through speakers and records via microphone
  const handleGenerateAudioFromScript = async () => {
    if (!form.script?.trim()) {
      toast.warning(
        safeT("guide.ai.noTextToSpeak", "No text to generate audio from")
      );
      return;
    }

    setIsGeneratingAudio(true);
    setLiveTranscript(
      "Generating audio... Please ensure your speakers are on and microphone is enabled."
    );
    toast.info(
      safeT(
        "guide.ai.generatingAudio",
        "Generating audio... The script will be read aloud and recorded."
      )
    );

    try {
      const result = await generateAudioFromText(
        form.script,
        speechLang,
        (progress) => {
          setLiveTranscript(progress);
        }
      );

      if (result.file) {
        setForm((prev) => ({
          ...prev,
          audio: result.file,
          audioPreview: result.url,
          existingAudio: null,
        }));
        toast.success(
          safeT("guide.ai.audioGenerated", "Audio generated successfully!")
        );
      } else {
        toast.warning(
          safeT(
            "guide.ai.audioGenerationFailed",
            "Could not generate audio. Please try recording instead."
          )
        );
      }
    } catch (error) {
      console.error("Failed to generate audio:", error);
      toast.error(
        error.message ||
          safeT(
            "guide.ai.audioGenerationFailed",
            "Failed to generate audio. Please allow microphone access."
          )
      );
    } finally {
      setIsGeneratingAudio(false);
      setLiveTranscript("");
    }
  };

  // Transcribe audio file to script - plays audio and uses speech recognition
  const handleAudioTranscription = useCallback(
    async (file) => {
      if (!file) return;

      setIsTranscribingAudio(true);
      setLiveTranscript(
        "Playing audio and transcribing... Please ensure your speakers are on."
      );
      toast.info(
        safeT(
          "guide.ai.transcribingAudio",
          "Transcribing audio... The audio will play through your speakers."
        )
      );

      try {
        const transcript = await transcribeAudioFile(
          file,
          speechLang,
          (progress) => {
            setLiveTranscript(progress);
          }
        );

        if (transcript) {
          setForm((p) => ({
            ...p,
            script: transcript, // Replace script with transcript
          }));
          toast.success(
            safeT(
              "guide.ai.transcriptionComplete",
              "Audio transcribed successfully!"
            )
          );
        } else {
          toast.warning(
            safeT(
              "guide.ai.noSpeechDetected",
              "No speech detected. You can add the script manually."
            )
          );
        }
      } catch (error) {
        console.error("Transcription failed:", error);
        toast.error(
          safeT(
            "guide.ai.transcriptionFailed",
            "Could not transcribe audio. Please add the script manually."
          )
        );
      } finally {
        setIsTranscribingAudio(false);
        setLiveTranscript("");
      }
    },
    [speechLang, safeT]
  );

  // Start/Stop voice recording with live transcription
  const handleVoiceRecording = async () => {
    if (isVoiceRecording) {
      // Stop recording
      try {
        const audioResult = await voiceRecorderRef.current?.stop();
        const transcript = liveTranscriberRef.current?.stop();

        if (audioResult) {
          // Set recorded audio to form
          setForm((prev) => ({
            ...prev,
            audio: audioResult.file,
            audioPreview: audioResult.url,
            existingAudio: null,
            // Add transcript to script if we got one
            script: transcript || prev.script,
          }));

          toast.success(
            safeT(
              "guide.ai.recordingComplete",
              "Recording complete! Audio and transcription ready."
            )
          );
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        toast.error(safeT("guide.ai.recordingError", "Error saving recording"));
      }

      setIsVoiceRecording(false);
      setLiveTranscript("");
      voiceRecorderRef.current = null;
      liveTranscriberRef.current = null;
      return;
    }

    // Start recording
    try {
      // Initialize voice recorder
      voiceRecorderRef.current = createVoiceRecorder();
      await voiceRecorderRef.current.start();

      // Initialize live transcriber
      liveTranscriberRef.current = createLiveTranscriber(speechLang);
      if (liveTranscriberRef.current) {
        liveTranscriberRef.current.start((interim, final) => {
          setLiveTranscript(interim);
        });
      }

      setIsVoiceRecording(true);
      toast.info(
        safeT("guide.ai.recordingStarted", "Recording started. Speak now...")
      );
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error(
        safeT(
          "guide.ai.microphoneError",
          error.message || "Could not access microphone"
        )
      );
    }
  };

  useEffect(() => {
    if (!tour) return;
    fetchItems();
  }, [tour]);

  useEffect(() => {
    if (open) {
      if (initialEditing) handleEdit(initialEditing);
      else {
        setEditing(null);
        setForm(defaultItemForm());
        setFormMode(initialFormMode || "create");
        setShowForm(true);
      }
    } else {
      setShowForm(false);
    }
  }, [open, initialEditing, initialFormMode]);

  useEffect(() => {
    return () => {
      revokePreview(form.audioPreview);
      revokePreview(form.mainImagePreview);
      (form.galleryImages || []).forEach((g) => revokePreview(g.preview));
      if (sparkIntervalRef.current) {
        clearInterval(sparkIntervalRef.current);
        sparkIntervalRef.current = null;
      }
    };
  }, []);

  const revokePreview = (url) => {
    try {
      if (url) URL.revokeObjectURL(url);
    } catch (e) {}
  };

  const fetchItems = useCallback(
    async (silent = false) => {
      if (!getTourId(tour)) return;
      if (!silent) setLoading(true);
      try {
        const data = await tourItemService.getTourItems(getTourId(tour));
        setItems(data || []);
      } catch (err) {
        if (!silent) toast.error("Failed to load waypoints");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [tour]
  );

  const resetForm = useCallback(() => {
    setEditing(null);
    setForm((prev) => {
      revokePreview(prev.audioPreview);
      revokePreview(prev.mainImagePreview);
      (prev.galleryImages || []).forEach((g) => revokePreview(g.preview));
      return defaultItemForm();
    });
    setShowForm(false);
    setTaken(false);
    if (sparkIntervalRef.current) {
      clearInterval(sparkIntervalRef.current);
      sparkIntervalRef.current = null;
    }
  }, []);

  const handleEdit = useCallback((item) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      location: item.location || { type: "Point", coordinates: [0, 0] },
      script: item.script || "",
      contentType: item.contentType || "informational",
      mainImage: null,
      mainImagePreview: null,
      galleryImages: [],
      audio: null,
      audioPreview: null,
      deletedGalleryImages: [],
      existingMainImage: item.mainImage || null,
      existingGallery: item.galleryImages || [],
      existingAudio: item.audio || null,
    });
    setShowForm(true);
    setFormMode("edit");
    setTaken(
      Boolean(
        item.location &&
          item.location.coordinates &&
          item.location.coordinates[0] !== 0 &&
          item.location.coordinates[1] !== 0
      )
    );
  }, []);

  const handleOpenGallery = useCallback((item) => {
    setEditing(item);
    setForm({
      ...defaultItemForm(),
      existingGallery: item.galleryImages || [],
      deletedGalleryImages: [],
    });
    setShowForm(true);
    setFormMode("gallery");
  }, []);

  const handleDelete = useCallback((item) => {
    setConfirmModal({ open: true, item });
  }, []);

  const confirmDelete = useCallback(async () => {
    const item = confirmModal.item;
    setConfirmModal({ open: false, item: null });
    if (!item) return;
    try {
      setDeletingIds((p) => [...p, item._id]);
      await tourItemService.deleteTourItem(getTourId(tour), item._id);
      toast.success("Waypoint deleted");
      await fetchItems(true);
      onUpdated && onUpdated();
    } catch (err) {
      toast.error("Failed to delete waypoint");
    } finally {
      setDeletingIds((p) => p.filter((id) => id !== item._id));
    }
  }, [confirmModal, tour, fetchItems, onUpdated]);

  const cancelDelete = useCallback(() => {
    setConfirmModal({ open: false, item: null });
  }, []);

  const handleFileChange = useCallback(
    (e, key, multiple = false) => {
      const files = Array.from(e.target.files || []);
      if (key === "mainImage" && !multiple) {
        const file = files[0] || null;
        setForm((p) => {
          revokePreview(p.mainImagePreview);
          return {
            ...p,
            mainImage: file,
            mainImagePreview: file ? URL.createObjectURL(file) : null,
          };
        });
      } else if (key === "audio" && !multiple) {
        const file = files[0] || null;
        setForm((p) => {
          revokePreview(p.audioPreview);
          return {
            ...p,
            audio: file,
            audioPreview: file ? URL.createObjectURL(file) : null,
          };
        });
        // Auto-transcribe the audio file to generate script
        if (file) {
          handleAudioTranscription(file);
        }
      } else if (key === "galleryImages" && multiple) {
        const mapped = files.map((f) => ({
          file: f,
          preview: URL.createObjectURL(f),
        }));
        setForm((p) => ({
          ...p,
          galleryImages: [...(p.galleryImages || []), ...mapped],
        }));
      }
    },
    [handleAudioTranscription]
  );

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setForm((p) => ({
          ...p,
          location: { type: "Point", coordinates: [lng, lat] },
        }));
        toast.success("Location detected");
        if (!taken) {
          setTaken(true);
          if (sparkIntervalRef.current) {
            clearInterval(sparkIntervalRef.current);
            sparkIntervalRef.current = null;
          }
        }
      },
      (err) => {
        toast.error("Unable to detect location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [taken]);

  const spawnSpark = useCallback(() => {
    const container = pinRef.current;
    if (!container) return;
    const spark = document.createElement("span");
    spark.className = "desert-key-spark";
    const px = Math.round(Math.random() * 60 + 20);
    const py = Math.round(Math.random() * 60 + 20);
    spark.style.position = "absolute";
    spark.style.left = `${px}%`;
    spark.style.top = `${py}%`;
    spark.style.pointerEvents = "none";
    const size = Math.max(4, Math.round(Math.random() * 8));
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.borderRadius = "50%";
    spark.style.opacity = "0";
    container.appendChild(spark);
    const remove = () => {
      try {
        spark.removeEventListener("animationend", remove);
        container.removeChild(spark);
      } catch (e) {}
    };
    spark.addEventListener("animationend", remove);
    requestAnimationFrame(() => {
      spark.style.opacity = "1";
      spark.classList.add("desert-key-spark-anim");
    });
  }, []);

  useEffect(() => {
    if (showForm && !taken) {
      if (sparkIntervalRef.current) {
        clearInterval(sparkIntervalRef.current);
        sparkIntervalRef.current = null;
      }
      spawnSpark();
      const interval = setInterval(() => {
        spawnSpark();
      }, 4200 + Math.floor(Math.random() * 3000));
      sparkIntervalRef.current = interval;
      return () => {
        if (sparkIntervalRef.current) {
          clearInterval(sparkIntervalRef.current);
          sparkIntervalRef.current = null;
        }
      };
    }
    return;
  }, [showForm, taken, spawnSpark]);

  const handleRemoveNewGallery = useCallback((index) => {
    setForm((p) => {
      const toRemove = p.galleryImages[index];
      const remaining = p.galleryImages.filter((_, i) => i !== index);
      try {
        if (toRemove && toRemove.preview) URL.revokeObjectURL(toRemove.preview);
      } catch (e) {}
      return { ...p, galleryImages: remaining };
    });
  }, []);

  const handleRemoveOldGallery = useCallback((publicId) => {
    setForm((p) => {
      const remaining = (p.existingGallery || []).filter(
        (img) => img.public_id !== publicId
      );
      return {
        ...p,
        existingGallery: remaining,
        deletedGalleryImages: [...(p.deletedGalleryImages || []), publicId],
      };
    });
  }, []);

  const submitForm = useCallback(
    async (e) => {
      e.preventDefault();
      const titleTrimmed = (form.title || "").trim();
      if (titleTrimmed.length < 3) {
        toast.error("Title must be at least 3 characters");
        return;
      }
      if (!form.script || form.script.trim().length === 0) {
        toast.error("Script is required for a waypoint");
        return;
      }
      setSubmitting(true);
      try {
        const fd = new FormData();
        fd.append("title", titleTrimmed);
        fd.append("tour", getTourId(tour));
        fd.append("location", JSON.stringify(form.location));
        fd.append("script", form.script || "");
        fd.append("contentType", form.contentType || "informational");
        if (form.mainImage) fd.append("mainImage", form.mainImage);
        if (form.audio) fd.append("audio", form.audio);
        (form.galleryImages || []).forEach((g) => {
          if (g && g.file) fd.append("galleryImages", g.file);
        });
        if (form.deletedGalleryImages && form.deletedGalleryImages.length) {
          fd.append(
            "deletedGalleryImages",
            JSON.stringify(form.deletedGalleryImages)
          );
        }
        if (editing) {
          await tourItemService.updateTourItem(
            getTourId(tour),
            editing._id,
            fd
          );
          toast.success("Waypoint updated");
        } else {
          await tourItemService.createTourItem(getTourId(tour), fd);
          toast.success("Waypoint created");
        }
        resetForm();
        await fetchItems();
        onUpdated && onUpdated();
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save waypoint";
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [form, editing, tour, resetForm, fetchItems, onUpdated]
  );

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50">
          {" "}
          <style>{`         @keyframes mapPinPulse {
          0% { text-shadow: 0 0 2px rgba(255,223,120,0.95); transform: scale(1); }
          40% { text-shadow: 0 0 22px rgba(255,223,120,0.98); transform: scale(1.18); }
          60% { text-shadow: 0 0 14px rgba(255,223,120,0.96); transform: scale(1.12); }
          100% { text-shadow: 0 0 2px rgba(255,223,120,0.95); transform: scale(1); }
        }
        .map-pin-pulse {
          animation: mapPinPulse 1.2s cubic-bezier(.2,.9,.2,1) infinite;
          will-change: transform, text-shadow;
        }
        .pin-with-halo {
          position: relative;
          isolation: isolate;
        }
        .pin-with-halo::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle at 50% 40%, rgba(255,245,200,0.95) 0%, rgba(255,223,120,0.55) 20%, rgba(213,179,106,0.12) 45%, transparent 70%);
          filter: blur(10px) saturate(1.1);
          opacity: 0.9;
          animation: haloPulse 1.2s cubic-bezier(.2,.9,.2,1) infinite;
        }
        @keyframes haloPulse {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; filter: blur(6px) saturate(1); }
          45% { transform: translate(-50%,-50%) scale(1.18); opacity: 1; filter: blur(14px) saturate(1.15); }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; filter: blur(6px) saturate(1); }
        }
        @keyframes desertSpark {
          0% { opacity: 0; transform: translate(0,0) scale(0.6); filter: blur(0px); }
          20% { opacity: 1; transform: translate(-8px,-8px) scale(1); filter: blur(0px); }
          100% { opacity: 0; transform: translate(-20px,-20px) scale(0.3); filter: blur(3px); }
        }
        .desert-key-spark {
          position: absolute;
          background: radial-gradient(circle, rgba(255,250,210,1) 0%, rgba(255,224,110,1) 40%, rgba(213,179,106,0.6) 70%, transparent 100%);
          pointer-events: none;
          transform-origin: center;
        }
        .desert-key-spark-anim {
          animation: desertSpark 900ms ease-out forwards;
        }
      `}</style>
          <div
            className={`max-w-3xl w-full mt-8 ${cardBg} rounded-xl border ${borderColor} p-6`}
          >
            {" "}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Waypoints for {tour?.name || tour}
              </h3>{" "}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetForm();
                    onClose && onClose();
                  }}
                  className="p-2 hover:bg-[#D5B36A]/20 rounded"
                >
                  {" "}
                  <FaTimes className={textColor} />{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <div className="space-y-4">
              {loading ? <div className={secondaryText}>Loading...</div> : null}{" "}
            </div>{" "}
            <div className="mt-4 border-t pt-4">
              {" "}
              <form onSubmit={submitForm} className="space-y-3">
                {" "}
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-1`}
                  >
                    Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                  />{" "}
                </div>
                <div
                  className="grid gap-3 items-end"
                  style={{ gridTemplateColumns: "45% 45% 10%" }}
                >
                  {" "}
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryText} mb-1`}
                    >
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.location.coordinates[0]}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          location: {
                            ...p.location,
                            coordinates: [
                              parseFloat(e.target.value || 0),
                              p.location.coordinates[1],
                            ],
                          },
                        }))
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                    />{" "}
                  </div>{" "}
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryText} mb-1`}
                    >
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.location.coordinates[1]}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          location: {
                            ...p.location,
                            coordinates: [
                              p.location.coordinates[0],
                              parseFloat(e.target.value || 0),
                            ],
                          },
                        }))
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                    />{" "}
                  </div>{" "}
                  <div>
                    <button
                      ref={pinRef}
                      type="button"
                      onClick={() => {
                        try {
                          setTaken(true);
                          if (sparkIntervalRef.current) {
                            clearInterval(sparkIntervalRef.current);
                            sparkIntervalRef.current = null;
                          }
                          const container = pinRef.current;
                          if (container) {
                            Array.from(
                              container.querySelectorAll(".desert-key-spark")
                            ).forEach((s) => s.remove());
                          }
                        } catch (e) {}
                        detectLocation();
                      }}
                      title="Detect my location"
                      className="h-12 w-full bg-transparent text-[var(--text)] transition-all justify-self-end flex items-center justify-center p-0 border-0 cursor-pointer"
                      style={{ background: "transparent" }}
                    >
                      <FaMapMarkerAlt
                        className={`w-5 h-5 text-[#D5B36A] ${
                          !taken ? "map-pin-pulse" : ""
                        }`}
                        style={{
                          textShadow: taken
                            ? "none"
                            : "0 0 1px rgba(213,179,106,0.95)",
                        }}
                      />{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Combined Script & Audio Section */}
                <div className="border-2 border-[#D5B36A]/40 rounded-xl p-4 bg-gradient-to-b from-[#1a0f08]/30 to-transparent">
                  {/* Language Selector - Prominent 3-button layout */}
                  <div className="mb-4">
                    <label
                      className={`block text-sm font-medium ${secondaryText} mb-2`}
                    >
                      {safeT("guide.ai.language", "Language")}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { code: "en", label: "English", flag: "🇬🇧" },
                        { code: "ar", label: "العربية", flag: "🇪🇬" },
                        { code: "es", label: "Español", flag: "🇪🇸" },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setSpeechLang(lang.code)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            speechLang === lang.code
                              ? "bg-[#D5B36A] text-black shadow-lg shadow-[#D5B36A]/30"
                              : `border ${borderColor} ${inputBg} ${textColor} hover:border-[#D5B36A] hover:bg-[#D5B36A]/10`
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                      {/* More languages dropdown */}
                      <select
                        value={
                          !["en", "ar", "es"].includes(speechLang)
                            ? speechLang
                            : ""
                        }
                        onChange={(e) =>
                          e.target.value && setSpeechLang(e.target.value)
                        }
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium border ${borderColor} ${inputBg} ${textColor} cursor-pointer`}
                      >
                        <option value="">+ More...</option>
                        {SUPPORTED_LANGUAGES.filter(
                          (l) => !["en", "ar", "es"].includes(l.code)
                        ).map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.nativeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Script Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className={`block text-sm font-medium ${secondaryText}`}
                      >
                        {safeT("guide.script", "Script")}
                      </label>
                      {/* Voice to Text & Preview buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSpeechToText}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isRecording
                              ? "bg-red-500 text-white animate-pulse"
                              : `border ${borderColor} ${textColor} hover:border-[#D5B36A]`
                          }`}
                          title={safeT("guide.ai.sttTooltip", "Voice to text")}
                        >
                          {isRecording ? (
                            <FaStop className="w-3 h-3" />
                          ) : (
                            <FaMicrophone className="w-3 h-3" />
                          )}
                          <span>{isRecording ? "Stop" : "Dictate"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleTextToSpeech}
                          disabled={!form.script?.trim()}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSpeaking
                              ? "bg-green-500 text-white"
                              : `border ${borderColor} ${textColor} hover:border-[#D5B36A] disabled:opacity-50`
                          }`}
                          title={safeT("guide.ai.ttsTooltip", "Read aloud")}
                        >
                          {isSpeaking ? (
                            <FaStop className="w-3 h-3" />
                          ) : (
                            <FaVolumeUp className="w-3 h-3" />
                          )}
                          <span>{isSpeaking ? "Stop" : "Preview"}</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={form.script}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, script: e.target.value }))
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                      rows={3}
                      required
                      placeholder={safeT(
                        "guide.scriptPlaceholder",
                        "Enter the script for this waypoint..."
                      )}
                    />
                  </div>

                  {/* Audio Section - 3 Action Buttons */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryText} mb-2`}
                    >
                      {safeT("guide.audio", "Audio")}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {/* Select Audio */}
                      <button
                        type="button"
                        onClick={() => audioRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#D5B36A] text-[#D5B36A] hover:shadow-lg hover:shadow-[#D5B36A]/20 transition-all"
                      >
                        <FaFileAudio className="w-4 h-4" />
                        <span>
                          {safeT("guide.ai.selectAudio", "Select Audio")}
                        </span>
                      </button>

                      {/* Record Audio */}
                      <button
                        type="button"
                        onClick={handleVoiceRecording}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          isVoiceRecording
                            ? "bg-red-500 border-2 border-red-400 text-white animate-pulse"
                            : "bg-gradient-to-b from-[#102c1a] to-[#081a0f] border-2 border-[#6AD5B3] text-[#6AD5B3] hover:shadow-lg hover:shadow-[#6AD5B3]/20"
                        }`}
                      >
                        {isVoiceRecording ? (
                          <>
                            <FaStop className="w-4 h-4" />
                            <span>
                              {safeT(
                                "guide.ai.stopRecording",
                                "Stop Recording"
                              )}
                            </span>
                          </>
                        ) : (
                          <>
                            <FaMicrophone className="w-4 h-4" />
                            <span>
                              {safeT("guide.ai.recordAudio", "Record Audio")}
                            </span>
                          </>
                        )}
                      </button>

                      {/* Generate Audio from Script */}
                      <button
                        type="button"
                        onClick={handleGenerateAudioFromScript}
                        disabled={
                          !form.script?.trim() ||
                          isGeneratingAudio ||
                          isTranscribingAudio
                        }
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          isGeneratingAudio
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-gradient-to-b from-[#1a1a2c] to-[#0f0f1a] border-2 border-[#6A8FD5] text-[#6A8FD5] hover:shadow-lg hover:shadow-[#6A8FD5]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                        title={safeT(
                          "guide.ai.generateAudioTooltip",
                          "Generate audio by reading the script aloud"
                        )}
                      >
                        {isGeneratingAudio ? (
                          <>
                            <FaSpinner className="w-4 h-4 animate-spin" />
                            <span>
                              {safeT("guide.ai.generating", "Generating...")}
                            </span>
                          </>
                        ) : (
                          <>
                            <FaMagic className="w-4 h-4" />
                            <span>
                              {safeT(
                                "guide.ai.generateAudio",
                                "Generate Audio"
                              )}
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Status message for audio operations */}
                    {(isGeneratingAudio ||
                      isTranscribingAudio ||
                      (isVoiceRecording && liveTranscript)) && (
                      <div
                        className={`mt-3 p-3 rounded-lg border ${
                          isVoiceRecording
                            ? "bg-[#1a2c10]/50 border-[#6AD5B3]/30"
                            : isTranscribingAudio
                            ? "bg-[#1a1a2c]/50 border-[#6A8FD5]/30"
                            : "bg-[#2c1810]/50 border-[#D5B36A]/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {isVoiceRecording ? (
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          ) : (
                            <FaSpinner className="w-4 h-4 animate-spin text-current" />
                          )}
                          <span
                            className={`text-xs ${
                              isVoiceRecording
                                ? "text-[#6AD5B3]"
                                : isTranscribingAudio
                                ? "text-[#6A8FD5]"
                                : "text-[#D5B36A]"
                            }`}
                          >
                            {isVoiceRecording
                              ? safeT(
                                  "guide.ai.liveTranscription",
                                  "Live Transcription"
                                )
                              : isTranscribingAudio
                              ? safeT(
                                  "guide.ai.transcribingAudio",
                                  "Transcribing Audio..."
                                )
                              : safeT(
                                  "guide.ai.generatingAudio",
                                  "Generating Audio..."
                                )}
                          </span>
                        </div>
                        {liveTranscript && (
                          <p className={`text-sm ${textColor}`}>
                            {liveTranscript}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      ref={audioRef}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, "audio", false)}
                      className="hidden"
                    />

                    {/* Existing audio preview */}
                    {form.existingAudio?.url && !form.audioPreview && (
                      <div className="mt-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                        <div className={`text-xs ${secondaryText} mb-1`}>
                          {safeT("guide.ai.existingAudio", "Current audio")}
                        </div>
                        <audio
                          controls
                          src={form.existingAudio.url}
                          className="w-full h-10"
                        />
                      </div>
                    )}

                    {/* New/Generated audio preview */}
                    {form.audioPreview && (
                      <div className="mt-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                        <div
                          className={`text-xs ${secondaryText} mb-1 flex items-center gap-2`}
                        >
                          <FaMusic className="text-[#D5B36A]" />
                          {safeT(
                            "guide.ai.audioPreview",
                            "New audio ready to upload"
                          )}
                        </div>
                        <audio
                          controls
                          src={form.audioPreview}
                          className="w-full h-10"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-1`}
                  >
                    Content Type
                  </label>
                  <select
                    value={form.contentType}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, contentType: e.target.value }))
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                  >
                    {" "}
                    <option value="informational">Informational</option>{" "}
                    <option value="interactive">Interactive</option>{" "}
                    <option value="activity">Activity</option>{" "}
                    <option value="photo-spot">Photo spot</option>{" "}
                  </select>{" "}
                </div>{" "}
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-1`}
                  >
                    Main Image
                  </label>
                  <button
                    type="button"
                    onClick={() => mainImageRef.current?.click()}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#D5B36A] text-[#D5B36A] rounded-lg shadow-lg hover:shadow-[#D5B36A]/30 hover:shadow-xl transition-all duration-300 font-semibold relative overflow-hidden group"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D5B36A' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      boxShadow:
                        "0 4px 15px rgba(213, 179, 106, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {" "}
                    <div className="absolute inset-0 bg-[#D5B36A]/0 group-hover:bg-[#D5B36A]/10 transition-colors duration-300"></div>{" "}
                    <FaImage className="text-[#D5B36A] group-hover:text-[#F5E6A3] transition-colors duration-300 z-10" />{" "}
                    <span className="z-10">Select Main Image</span>{" "}
                  </button>
                  <input
                    ref={mainImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "mainImage", false)}
                    className="hidden"
                  />
                  {form.mainImagePreview ? (
                    <div className="mt-2">
                      <div className={`text-xs ${secondaryText} mb-1`}>
                        New main image
                      </div>{" "}
                      <img
                        src={form.mainImagePreview}
                        alt="new"
                        className="w-48 h-28 object-cover rounded"
                      />{" "}
                    </div>
                  ) : form.existingMainImage?.url ? (
                    <div className="mt-2">
                      <div className={`text-xs ${secondaryText} mb-1`}>
                        Existing main image
                      </div>{" "}
                      <img
                        src={form.existingMainImage.url}
                        alt="existing"
                        className="w-48 h-28 object-cover rounded"
                      />{" "}
                    </div>
                  ) : null}{" "}
                </div>{" "}
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-3`}
                  >
                    Gallery Images
                  </label>
                  <input
                    ref={galleryRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, "galleryImages", true)}
                    className="hidden"
                  />{" "}
                  <div className="grid grid-cols-4 gap-3">
                    {(form.existingGallery || [])
                      .filter(
                        (img) =>
                          !form.deletedGalleryImages?.includes(img.public_id)
                      )
                      .map((img) => (
                        <div key={img.public_id} className="relative group">
                          {" "}
                          <div className="aspect-square bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#D5B36A] rounded-lg overflow-hidden shadow-lg hover:shadow-[#D5B36A]/30 transition-all duration-300">
                            {" "}
                            <img
                              src={img.url}
                              alt={img.public_id}
                              className="w-full h-full object-cover"
                            />{" "}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveOldGallery(img.public_id)
                                }
                                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                              >
                                {" "}
                                <FaTimes size={14} />{" "}
                              </button>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>
                      ))}
                    {(form.galleryImages || []).map((g, idx) => (
                      <div key={`new-${idx}`} className="relative group">
                        {" "}
                        <div className="aspect-square bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#4ade80] rounded-lg overflow-hidden shadow-lg hover:shadow-[#4ade80]/30 transition-all duration-300">
                          {" "}
                          <img
                            src={g.preview}
                            alt={g.file.name}
                            className="w-full h-full object-cover"
                          />{" "}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleRemoveNewGallery(idx)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                            >
                              {" "}
                              <FaTimes size={14} />{" "}
                            </button>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>
                    ))}
                    <div
                      onClick={() => galleryRef.current?.click()}
                      className="aspect-square bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-dashed border-[#D5B36A] rounded-lg cursor-pointer hover:border-[#F5E6A3] hover:shadow-lg hover:shadow-[#D5B36A]/30 transition-all duration-300 flex flex-col items-center justify-center group"
                    >
                      {" "}
                      <div className="text-3xl text-[#D5B36A] group-hover:text-[#F5E6A3] transition-colors duration-300 mb-2">
                        {" "}
                        <FaPlus />{" "}
                      </div>
                      <div
                        className={`text-xs font-medium ${secondaryText} group-hover:text-[#D5B36A] transition-colors duration-300 text-center`}
                      >
                        Add Images
                      </div>{" "}
                    </div>{" "}
                  </div>
                  {((form.existingGallery || []).filter(
                    (img) => !form.deletedGalleryImages?.includes(img.public_id)
                  ).length > 0 ||
                    (form.galleryImages || []).length > 0) && (
                    <div
                      className={`text-xs ${secondaryText} mt-3 text-center`}
                    >
                      {(form.existingGallery || []).filter(
                        (img) =>
                          !form.deletedGalleryImages?.includes(img.public_id)
                      ).length + (form.galleryImages || []).length}{" "}
                      images in gallery{" "}
                    </div>
                  )}{" "}
                </div>{" "}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      if (onClose) onClose();
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${textColor} hover:bg-[#D5B36A]/10`}
                  >
                    Cancel{" "}
                  </button>{" "}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting && <FaSpinner className="animate-spin" />}
                    {editing ? "Update" : "Create"}{" "}
                  </button>{" "}
                </div>{" "}
              </form>{" "}
            </div>
            <ConfirmModal
              isOpen={confirmModal.open}
              title="Confirm Delete"
              message={`Are you sure you want to delete the waypoint "${confirmModal.item?.title}"? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              type="danger"
            />{" "}
          </div>{" "}
        </div>
      )}
    </>
  );
};

export default TourItemsManager;
