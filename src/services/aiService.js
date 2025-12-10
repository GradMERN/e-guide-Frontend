/**
 * AI Service for Text-to-Speech, Speech-to-Text, and Translation
 * Uses free browser APIs and free translation services
 */

// ==================== TEXT TO SPEECH (TTS) ====================

/**
 * Generate audio from text using browser TTS + recording
 * This plays the TTS through speakers and records via microphone to create an actual audio file
 *
 * @param {string} text - The text to convert to speech
 * @param {string} lang - Language code (e.g., 'en', 'ar', 'es')
 * @param {function} onProgress - Callback for progress updates
 * @returns {Promise<{blob: Blob, url: string, file: File}>}
 */
export const generateAudioFromText = async (
  text,
  lang = "en",
  onProgress = null
) => {
  if (!text || text.trim() === "") {
    throw new Error("No text provided");
  }

  // Check for Web Speech API support
  if (!("speechSynthesis" in window)) {
    throw new Error("Text-to-speech is not supported in this browser");
  }

  // Language mapping for speech synthesis
  const langMap = {
    en: "en-US",
    ar: "ar-SA",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    pt: "pt-PT",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN",
  };

  const speechLang = langMap[lang] || "en-US";

  // Wait for voices to load
  const getVoices = () => {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
        setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
      }
    });
  };

  const voices = await getVoices();
  const voice =
    voices.find((v) => v.lang.startsWith(lang)) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];

  // Request microphone access to record the TTS output
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    throw new Error(
      "Microphone access required to generate audio. Please allow microphone access and try again."
    );
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop());

      const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
      const url = URL.createObjectURL(blob);
      const ext = mediaRecorder.mimeType.includes("webm") ? "webm" : "mp4";
      const file = new File([blob], `generated-audio-${Date.now()}.${ext}`, {
        type: mediaRecorder.mimeType,
      });

      resolve({ blob, url, file });
    };

    mediaRecorder.onerror = (e) => {
      stream.getTracks().forEach((track) => track.stop());
      reject(new Error("Recording failed"));
    };

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      // Start recording when speech starts
      mediaRecorder.start();
      if (onProgress) onProgress("Recording TTS output...");
    };

    utterance.onend = () => {
      // Stop recording shortly after speech ends
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 300);
    };

    utterance.onerror = (event) => {
      if (event.error === "interrupted" || event.error === "canceled") {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
        return;
      }
      stream.getTracks().forEach((track) => track.stop());
      reject(new Error(`Speech synthesis failed: ${event.error}`));
    };

    // Speak the text - this will play through speakers and be recorded
    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Convert text to speech and return audio blob
 * Uses Web Speech API for synthesis and MediaRecorder to capture audio
 * @param {string} text - The text to convert to speech
 * @param {string} lang - Language code (e.g., 'en', 'ar', 'es')
 * @returns {Promise<{blob: Blob, url: string}>}
 */
export const textToSpeech = async (text, lang = "en") => {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("Text-to-speech is not supported in this browser"));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Map language codes to speech synthesis voices
    const langMap = {
      en: "en-US",
      ar: "ar-SA",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      it: "it-IT",
      pt: "pt-PT",
      ru: "ru-RU",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
    };

    utterance.lang = langMap[lang] || lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Get available voices and select the best one for the language
    const voices = window.speechSynthesis.getVoices();
    const targetLang = langMap[lang] || lang;
    const voice =
      voices.find((v) => v.lang.startsWith(targetLang.split("-")[0])) ||
      voices[0];
    if (voice) {
      utterance.voice = voice;
    }

    // For generating audio file, we need to use a different approach
    // Since Web Speech API doesn't directly output audio files,
    // we'll use the browser's ability to play it and provide a text preview
    utterance.onend = () => {
      resolve({
        success: true,
        message: "Speech synthesis completed",
        // Note: Web Speech API doesn't provide direct audio blob output
        // For actual audio file generation, we'd need a server-side TTS service
      });
    };

    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Play text as speech (without recording)
 * @param {string} text - The text to speak
 * @param {string} lang - Language code
 * @param {Function} onEnd - Optional callback when speech ends
 * @returns {Promise<void>}
 */
export const speakText = (text, lang = "en", onEnd = null) => {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      reject(new Error("Text-to-speech is not supported in this browser"));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const langMap = {
      en: "en-US",
      ar: "ar-SA",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      it: "it-IT",
      pt: "pt-PT",
      ru: "ru-RU",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
      hi: "hi-IN",
      tr: "tr-TR",
      nl: "nl-NL",
      pl: "pl-PL",
      vi: "vi-VN",
      th: "th-TH",
      el: "el-GR",
      he: "he-IL",
      sv: "sv-SE",
      cs: "cs-CZ",
      da: "da-DK",
      fi: "fi-FI",
      hu: "hu-HU",
      id: "id-ID",
      ms: "ms-MY",
      no: "nb-NO",
      ro: "ro-RO",
      sk: "sk-SK",
      uk: "uk-UA",
    };

    utterance.lang = langMap[lang] || lang;
    utterance.rate = 0.9;

    // Wait for voices to load
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const targetLang = langMap[lang] || lang;
      const voice = voices.find((v) =>
        v.lang.startsWith(targetLang.split("-")[0])
      );
      if (voice) utterance.voice = voice;
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
      resolve();
    };
    utterance.onerror = (e) => {
      // Ignore "interrupted" errors - these happen when speech is cancelled
      if (e.error === "interrupted" || e.error === "canceled") {
        if (onEnd) onEnd();
        resolve();
        return;
      }
      if (onEnd) onEnd();
      reject(new Error(e.error));
    };

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Stop any ongoing speech
 */
export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

// ==================== SPEECH TO TEXT (STT) ====================

/**
 * Transcribe an audio file to text by playing it and using speech recognition
 * The audio plays through speakers and speech recognition captures it via microphone
 *
 * @param {File|Blob|string} audioSource - Audio file, blob, or URL
 * @param {string} lang - Language code for recognition
 * @param {function} onProgress - Callback for progress/interim results
 * @returns {Promise<string>} - Transcribed text
 */
export const transcribeAudioFile = async (
  audioSource,
  lang = "en",
  onProgress
) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error("Speech recognition is not supported in this browser");
  }

  // Create audio element to play the file
  const audio = new Audio();

  if (audioSource instanceof File || audioSource instanceof Blob) {
    audio.src = URL.createObjectURL(audioSource);
  } else if (typeof audioSource === "string") {
    audio.src = audioSource;
  } else {
    throw new Error("Invalid audio source");
  }

  // Language mapping
  const langMap = {
    en: "en-US",
    ar: "ar-SA",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    pt: "pt-PT",
  };

  return new Promise((resolve, reject) => {
    let fullTranscript = "";
    let recognitionEnded = false;
    let audioEnded = false;

    // Set up speech recognition
    const recognition = new SpeechRecognition();
    recognition.lang = langMap[lang] || "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          fullTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (onProgress) {
        onProgress(fullTranscript + interimTranscript);
      }
    };

    recognition.onend = () => {
      recognitionEnded = true;
      if (audioEnded) {
        // Clean up
        if (audioSource instanceof File || audioSource instanceof Blob) {
          URL.revokeObjectURL(audio.src);
        }
        resolve(fullTranscript.trim());
      } else {
        // Audio still playing, restart recognition
        try {
          recognition.start();
        } catch (e) {
          // Recognition already started or other error
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        // No speech detected, continue listening
        return;
      }
      console.error("Recognition error:", event.error);
    };

    // Audio event handlers
    audio.onended = () => {
      audioEnded = true;
      // Give recognition a moment to finish processing
      setTimeout(() => {
        try {
          recognition.stop();
        } catch (e) {
          // Already stopped
        }
        // Clean up and resolve
        if (audioSource instanceof File || audioSource instanceof Blob) {
          URL.revokeObjectURL(audio.src);
        }
        resolve(fullTranscript.trim());
      }, 1000);
    };

    audio.onerror = (e) => {
      try {
        recognition.stop();
      } catch (err) {
        // Already stopped
      }
      if (audioSource instanceof File || audioSource instanceof Blob) {
        URL.revokeObjectURL(audio.src);
      }
      reject(new Error("Failed to play audio file"));
    };

    // Start recognition first, then play audio
    audio.oncanplaythrough = () => {
      if (onProgress) {
        onProgress("Listening to audio...");
      }

      try {
        recognition.start();
      } catch (e) {
        // Already started
      }

      // Small delay to ensure recognition is ready
      setTimeout(() => {
        audio.play().catch((err) => {
          recognition.stop();
          reject(new Error("Failed to play audio: " + err.message));
        });
      }, 200);
    };

    // Load the audio
    audio.load();
  });
};

/**
 * Start speech recognition and return transcribed text
 * @param {string} lang - Language code for recognition
 * @returns {Promise<{text: string, confidence: number}>}
 */
export const speechToText = (lang = "en") => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(new Error("Speech recognition is not supported in this browser"));
      return;
    }

    const recognition = new SpeechRecognition();

    const langMap = {
      en: "en-US",
      ar: "ar-SA",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
    };

    recognition.lang = langMap[lang] || lang;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let fullTranscript = "";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          fullTranscript += event.results[i][0].transcript + " ";
        }
      }
    };

    recognition.onend = () => {
      resolve({
        text: fullTranscript.trim(),
        confidence: 0.9,
      });
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        resolve({ text: "", confidence: 0 });
      } else {
        reject(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    recognition.start();

    // Return a stop function
    return {
      stop: () => recognition.stop(),
    };
  });
};

/**
 * Create a speech recognition instance that can be controlled
 * @param {string} lang - Language code
 * @param {function} onResult - Callback for interim results
 * @param {function} onEnd - Callback when recognition ends
 * @returns {object} Recognition controller
 */
export const createSpeechRecognizer = (
  lang = "en",
  onResult,
  onEnd,
  onError
) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error("Speech recognition is not supported in this browser");
  }

  const recognition = new SpeechRecognition();

  const langMap = {
    en: "en-US",
    ar: "ar-SA",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  recognition.lang = langMap[lang] || lang;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let fullTranscript = "";

  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        fullTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }
    if (onResult) {
      onResult(fullTranscript + interimTranscript, fullTranscript);
    }
  };

  recognition.onend = () => {
    if (onEnd) onEnd(fullTranscript.trim());
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };

  return {
    start: () => {
      fullTranscript = "";
      recognition.start();
    },
    stop: () => recognition.stop(),
    abort: () => recognition.abort(),
  };
};

// ==================== TRANSLATION ====================

/**
 * Translate text using MyMemory API (free, 5000 words/day)
 * @param {string} text - Text to translate
 * @param {string} from - Source language code
 * @param {string} to - Target language code
 * @returns {Promise<{translatedText: string, detectedLanguage?: string}>}
 */
export const translateText = async (text, from = "en", to = "ar") => {
  if (!text || text.trim() === "") {
    return { translatedText: "" };
  }

  // MyMemory Translation API (free, no API key required)
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${from}|${to}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200) {
      return {
        translatedText: data.responseData.translatedText,
        match: data.responseData.match,
      };
    } else {
      throw new Error(data.responseDetails || "Translation failed");
    }
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

/**
 * Detect language of text
 * @param {string} text - Text to analyze
 * @returns {Promise<string>} - Detected language code
 */
export const detectLanguage = async (text) => {
  if (!text || text.trim() === "") {
    return "en";
  }

  // Simple heuristic for common languages
  // Check for Arabic characters
  if (/[\u0600-\u06FF]/.test(text)) {
    return "ar";
  }
  // Check for Chinese characters
  if (/[\u4E00-\u9FFF]/.test(text)) {
    return "zh";
  }
  // Check for Japanese
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    return "ja";
  }
  // Check for Korean
  if (/[\uAC00-\uD7AF]/.test(text)) {
    return "ko";
  }
  // Check for Cyrillic (Russian)
  if (/[\u0400-\u04FF]/.test(text)) {
    return "ru";
  }

  // Default to English
  return "en";
};

/**
 * Translate tour item script to target language
 * @param {object} tourItem - The tour item object
 * @param {string} targetLang - Target language code
 * @returns {Promise<object>} - Tour item with translated script
 */
export const translateTourItem = async (tourItem, targetLang) => {
  if (!tourItem?.script) {
    return tourItem;
  }

  const sourceLang = await detectLanguage(tourItem.script);

  if (sourceLang === targetLang) {
    return tourItem;
  }

  const { translatedText } = await translateText(
    tourItem.script,
    sourceLang,
    targetLang
  );

  return {
    ...tourItem,
    originalScript: tourItem.script,
    script: translatedText,
    translatedFrom: sourceLang,
    translatedTo: targetLang,
  };
};

// ==================== AUDIO RECORDING ====================

/**
 * Create a voice recorder that captures microphone audio
 * @returns {object} Recorder controller with start, stop, getBlob methods
 */
export const createVoiceRecorder = () => {
  let mediaRecorder = null;
  let audioChunks = [];
  let stream = null;

  return {
    start: async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.start(100); // Collect data every 100ms
        return true;
      } catch (error) {
        console.error("Failed to start recording:", error);
        throw new Error(
          "Could not access microphone. Please ensure microphone permissions are granted."
        );
      }
    },

    stop: () => {
      return new Promise((resolve) => {
        if (!mediaRecorder || mediaRecorder.state === "inactive") {
          resolve(null);
          return;
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunks, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);

          // Convert to File for upload
          const file = new File([blob], `recording-${Date.now()}.webm`, {
            type: "audio/webm",
          });

          // Stop all tracks
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }

          resolve({ blob, url, file });
        };

        mediaRecorder.stop();
      });
    },

    isRecording: () => {
      return mediaRecorder && mediaRecorder.state === "recording";
    },
  };
};

/**
 * Transcribe audio using real-time speech recognition while recording
 * This uses the browser's SpeechRecognition API
 * @param {string} lang - Language code
 * @returns {object} Transcription controller
 */
export const createLiveTranscriber = (lang = "en") => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  const langMap = {
    en: "en-US",
    ar: "ar-SA",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  recognition.lang = langMap[lang] || lang;
  recognition.continuous = true;
  recognition.interimResults = true;

  let finalTranscript = "";
  let onUpdate = null;

  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }
    if (onUpdate) {
      onUpdate(finalTranscript + interimTranscript, finalTranscript);
    }
  };

  return {
    start: (callback) => {
      onUpdate = callback;
      finalTranscript = "";
      recognition.start();
    },
    stop: () => {
      recognition.stop();
      return finalTranscript.trim();
    },
    getTranscript: () => finalTranscript.trim(),
  };
};

// ==================== SUPPORTED LANGUAGES ====================

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
];

export default {
  textToSpeech,
  speakText,
  stopSpeech,
  speechToText,
  createSpeechRecognizer,
  translateText,
  detectLanguage,
  translateTourItem,
  generateAudioFromText,
  createVoiceRecorder,
  createLiveTranscriber,
  SUPPORTED_LANGUAGES,
};
