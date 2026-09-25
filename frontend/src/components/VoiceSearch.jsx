import { useState } from 'react';

export default function VoiceSearch({ onResult, placeholder = 'बोलून शोधा' }) {
  const [listening, setListening] = useState(false);

  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('तुमच्या मोबाइलवर आवाज ओळखता येत नाही. कृपया Chrome वापरा.');
      return;
    }

    const recognition = new SR();
    recognition.lang = 'mr-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      console.error('आवाज त्रुटी:', e.error);
      setListening(false);
    };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      if (onResult) onResult(text);
    };

    recognition.start();
  };

  return (
    <button
      onClick={start}
      title={placeholder}
      style={{
        padding: '12px 18px',
        borderRadius: 12,
        border: '2px solid #2e7d32',
        background: listening ? '#2e7d32' : '#fff',
        color: listening ? '#fff' : '#2e7d32',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}
    >
      {listening ? '🎙️ ऐकतोय...' : '🎤 बोला'}
    </button>
  );
}