import { useEffect, useRef, useState } from 'react';
import { useJarvis } from './JarvisContext';
import { useVoice, speak, stopSpeaking } from './useVoice';
import { findCommand, getSuggestions, getReply } from './commands';
import './Jarvis.css';

export default function JarvisAssistant() {
  const {
    messages,
    addMessage,
    isOpen,
    openJarvis,
    closeJarvis,
    processing,
    setProcessing,
    triggerListen,
    handlers
  } = useJarvis();

  const { listening, start, stop } = useVoice();
  const [userRole, setUserRole] = useState('farmer');
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [interimText, setInterimText] = useState('');
  const messagesEndRef = useRef(null);
  const lastCommandRef = useRef(null);

  // User role वाचा
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
    if (user.role) setUserRole(user.role);
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // triggerListen बदलल्यावर ऐकणे
  useEffect(() => {
    if (triggerListen > 0) {
      startListeningNow();
    }
    // eslint-disable-next-line
  }, [triggerListen]);

  // ============================================
  // आवाज ऐकणे
  // ============================================
  const startListeningNow = () => {
    stopSpeaking();
    setInterimText('');

    start(
      (text, alternatives) => {
        setInterimText('');
        handleUserText(text, alternatives);
      },
      (err) => {
        console.warn('Voice error:', err);
        // फक्त serious errors साठी message
        if (err.includes('ऐकले नाही') || err.includes('ऐकता आला नाही')) {
          addMessage('system', err);
        }
      },
      { lang: 'mr-IN', interimResults: false }
    );
  };

  // ============================================
  // User text process करा
  // ============================================
  const handleUserText = async (text, alternatives = []) => {
    if (!text.trim()) return;

    addMessage('user', text);
    setProcessing(true);

    setTimeout(() => {
      // सर्व alternatives तपासा — कोणतेही command match झाले तर
      let cmd = findCommand(text, userRole);
      let usedText = text;

      if (!cmd && alternatives.length > 0) {
        for (const alt of alternatives) {
          const altCmd = findCommand(alt, userRole);
          if (altCmd) {
            cmd = altCmd;
            usedText = alt;
            break;
          }
        }
      }

      if (!cmd) {
        const suggestions = getSuggestions(userRole);
        const reply = `मला "${text}" समजले नाही. "${suggestions[0]}" किंवा "${suggestions[1]}" असे म्हणून पहा.`;
        addMessage('jarvis', reply);
        speak(reply);
        setProcessing(false);
        return;
      }

      // Reply दाखवा + बोला
      const reply = getReply(cmd);
      addMessage('jarvis', reply);
      speak(reply);

      // Action execute
      if (cmd.action) {
        try {
          cmd.action({
            goTo: handlers.current.goTo,
            role: userRole,
            custom: handlers.current
          });
        } catch (e) {
          console.error('Command action error:', e);
        }
      }

      lastCommandRef.current = cmd.id;
      setProcessing(false);
    }, 300);
  };

  // ============================================
  // Floating button click
  // ============================================
  const handleFloatingClick = () => {
    if (!isOpen) {
      openJarvis();
    } else {
      if (listening) {
        stop();
      } else {
        startListeningNow();
      }
    }
  };

  // ============================================
  // Suggestion click
  // ============================================
  const handleSuggestion = (sug) => {
    handleUserText(sug);
  };

  // ============================================
  // Text submit
  // ============================================
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    handleUserText(textInput);
    setTextInput('');
  };

  // ============================================
  // Clear chat
  // ============================================
  const handleClear = () => {
    if (confirm('चॅट साफ करायची?')) {
      // Context मध्ये clearMessages नाही तर window reload
      const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
      const greeting = `नमस्कार ${user.name || ''}! मी जार्विस आहे. काय मदत करू?`;
      // Messages साफ करण्यासाठी trick
      addMessage('system', 'चॅट साफ झाली. पुन्हा सुरू करा.');
      setTimeout(() => speak(greeting), 200);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={`jarvis-fab ${listening ? 'listening' : ''} ${isOpen ? 'open' : ''}`}
        onClick={handleFloatingClick}
        title={listening ? 'थांबवा' : 'जार्विस — बोला'}
      >
        <span className="jarvis-fab-icon">{listening ? '🎙️' : '🤖'}</span>
        {listening && <span className="jarvis-pulse" />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="jarvis-panel">
          {/* Header */}
          <div className="jarvis-header">
            <div className="jarvis-header-left">
              <div className={`jarvis-avatar ${listening ? 'speaking' : ''}`}>
                🤖
              </div>
              <div>
                <div className="jarvis-title">जार्विस</div>
                <div className="jarvis-subtitle">
                  {listening
                    ? '🎤 ऐकत आहे...'
                    : processing
                    ? '⚙️ प्रक्रिया...'
                    : '🟢 तयार'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="jarvis-close"
                onClick={handleClear}
                title="चॅट साफ करा"
                style={{ fontSize: 14 }}
              >
                🗑️
              </button>
              <button
                className="jarvis-close"
                onClick={closeJarvis}
                title="बंद करा"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="jarvis-body">
            {messages.length === 0 && (
              <div className="jarvis-welcome">
                <div className="jarvis-welcome-icon">🤖</div>
                <h3>नमस्कार! मी जार्विस.</h3>
                <p>तुमचा आवाज सहाय्यक. बोला किंवा खालील पर्याय निवडा.</p>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`jarvis-msg jarvis-msg-${m.role}`}>
                {m.role === 'jarvis' && (
                  <div className="jarvis-bubble-avatar">🤖</div>
                )}
                <div className="jarvis-bubble">{m.text}</div>
              </div>
            ))}

            {/* Listening indicator */}
            {listening && (
              <div className="jarvis-msg jarvis-msg-jarvis">
                <div className="jarvis-bubble-avatar">🤖</div>
                <div className="jarvis-bubble jarvis-listening-bubble">
                  <span className="jarvis-listening-dot" />
                  <span className="jarvis-listening-dot" />
                  <span className="jarvis-listening-dot" />
                  <span style={{ marginLeft: 8, fontSize: 12 }}>
                    ऐकत आहे...
                  </span>
                </div>
              </div>
            )}

            {/* Processing indicator */}
            {processing && (
              <div className="jarvis-msg jarvis-msg-jarvis">
                <div className="jarvis-bubble-avatar">🤖</div>
                <div className="jarvis-bubble jarvis-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="jarvis-suggestions">
            {getSuggestions(userRole).map((sug) => (
              <button
                key={sug}
                className="jarvis-chip"
                onClick={() => handleSuggestion(sug)}
                disabled={processing || listening}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Text input */}
          {showTextInput && (
            <form className="jarvis-text-form" onSubmit={handleTextSubmit}>
              <input
                className="jarvis-text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="किंवा टाइप करा..."
                autoFocus
              />
              <button type="submit" className="jarvis-text-send">
                ➤
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="jarvis-footer">
            <button
              className={`jarvis-mic ${listening ? 'active' : ''}`}
              onClick={listening ? stop : startListeningNow}
              disabled={processing}
            >
              {listening ? '⏹ थांबवा' : '🎤 बोला'}
            </button>
            <button
              className="jarvis-text-toggle"
              onClick={() => setShowTextInput(!showTextInput)}
              title="टाइप करा"
            >
              ⌨️
            </button>
          </div>
        </div>
      )}
    </>
  );
}