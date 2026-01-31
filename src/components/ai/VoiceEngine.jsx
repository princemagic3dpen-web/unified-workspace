import { useEffect, useRef } from 'react';

export const useVoiceEngine = () => {
  const synthRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialiser Web Speech API
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!synthRef.current) {
        reject(new Error('Synthèse vocale non disponible'));
        return;
      }

      // Annuler toute parole en cours
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configuration voix
      const voices = synthRef.current.getVoices();
      const frenchVoice = voices.find(v => 
        v.lang.startsWith('fr') && (options.gender === 'female' ? v.name.includes('Female') : true)
      ) || voices.find(v => v.lang.startsWith('fr')) || voices[0];
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.lang = 'fr-FR';
      utterance.rate = options.rate || 1.0; // Vitesse
      utterance.pitch = options.pitch || 1.0; // Ton
      utterance.volume = options.volume || 1.0; // Volume

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      synthRef.current.speak(utterance);
    });
  };

  const startListening = (onResult, onEnd) => {
    if (!recognitionRef.current) {
      console.error('Reconnaissance vocale non disponible');
      return;
    }

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      const isFinal = event.results[event.results.length - 1].isFinal;
      
      onResult({ transcript, isFinal });
    };

    recognitionRef.current.onend = () => {
      if (onEnd) onEnd();
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return {
    speak,
    startListening,
    stopListening,
    stopSpeaking,
    isAvailable: !!(synthRef.current && recognitionRef.current)
  };
};

// Voix émotionnelles
export const VOICE_EMOTIONS = {
  neutral: { rate: 1.0, pitch: 1.0 },
  happy: { rate: 1.1, pitch: 1.2 },
  sad: { rate: 0.9, pitch: 0.8 },
  excited: { rate: 1.2, pitch: 1.3 },
  calm: { rate: 0.95, pitch: 0.9 },
  professional: { rate: 1.0, pitch: 1.0 }
};