import { useRef, useState, useCallback, useEffect } from 'react';

// आवाज ऐकण्यासाठी
export function useVoice() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  const start = useCallback((onResult, onError, options = {}) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      setSupported(false);
      onError && onError('तुमच्या ब्राउझरमध्ये आवाज ओळख नाही. Chrome वापरा.');
      return;
    }

    // जुने थांबवा
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const recognition = new SR();
    recognition.lang = options.lang || 'mr-IN'; // मराठी default
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || false;
    recognition.maxAlternatives = 3; // अजून पर्याय

    let finalTranscript = '';

    recognition.onstart = () => {
      setListening(true);
      setTranscript('');
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (e) => {
      setListening(false);
      if (e.error === 'no-speech') {
        onError && onError('काहीच ऐकले नाही. पुन्हा बोला.');
      } else if (e.error === 'not-allowed') {
        onError && onError('मायक्रोफोन परवानगी नाकारली.');
      } else if (e.error !== 'aborted') {
        onError && onError('आवाज ओळखता आला नाही: ' + e.error);
      }
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interim += t;
        }
      }
      setTranscript(finalTranscript || interim);

      // सर्व पर्याय तपासा
      if (finalTranscript) {
        const alternatives = [];
        for (let i = 0; i < event.results.length; i++) {
          for (let j = 0; j < event.results[i].length; j++) {
            alternatives.push(event.results[i][j].transcript);
          }
        }
        onResult && onResult(finalTranscript, alternatives);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      setListening(false);
      onError && onError('मायक्रोफोन सुरू करता आला नाही');
    }
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setListening(false);
  }, []);

  return { listening, start, stop, supported, transcript };
}

// ============================================
// Speech Synthesis — Jarvis मराठीत बोलतो
// ============================================
let voicesCache = null;

function loadVoices() {
  return new Promise((resolve) => {
    if (voicesCache) return resolve(voicesCache);

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesCache = voices;
      return resolve(voices);
    }

    window.speechSynthesis.onvoiceschanged = () => {
      voicesCache = window.speechSynthesis.getVoices();
      resolve(voicesCache);
    };

    // Fallback
    setTimeout(() => {
      voicesCache = window.speechSynthesis.getVoices();
      resolve(voicesCache);
    }, 500);
  });
}

export async function speak(text, options = {}) {
  if (!('speechSynthesis' in window)) return;
  if (!text) return;

  // जुने थांबवा
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || 'mr-IN';
  utterance.rate = options.rate || 0.95;
  utterance.pitch = options.pitch || 1.05;
  utterance.volume = options.volume || 1.0;

  try {
    const voices = await loadVoices();
    // मराठी → हिंदी → इंग्रजी (India) → पहिला
    const marathiVoice = voices.find((v) => v.lang === 'mr-IN' || v.lang.startsWith('mr'));
    const hindiVoice = voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
    const indianEnglish = voices.find((v) => v.lang === 'en-IN');
    const anyEnglish = voices.find((v) => v.lang.startsWith('en'));

    utterance.voice =
      marathiVoice || hindiVoice || indianEnglish || anyEnglish || voices[0];
  } catch (e) {
    console.warn('Voice load error:', e);
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}