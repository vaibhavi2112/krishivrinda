import { createContext, useContext, useState, useRef } from 'react';

const JarvisContext = createContext(null);

export function JarvisProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [triggerListen, setTriggerListen] = useState(0);
  const handlersRef = useRef({});

  // Dashboard मधून register केले जातील
  const registerHandlers = (handlers) => {
    handlersRef.current = { ...handlersRef.current, ...handlers };
  };

  const addMessage = (role, text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), role, text, time: new Date() }
    ]);
  };

  const clearMessages = () => setMessages([]);

  const openJarvis = () => {
    setIsOpen(true);
    // पहिल्यांदा उघडल्यावर greeting
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage('jarvis', 'नमस्कार! मी जार्विस आहे. 🎤 बटण दाबा आणि बोला.');
      }, 300);
    }
  };

  const closeJarvis = () => setIsOpen(false);

  const startListening = () => {
    setTriggerListen((n) => n + 1);
  };

  return (
    <JarvisContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        isOpen,
        openJarvis,
        closeJarvis,
        processing,
        setProcessing,
        triggerListen,
        startListening,
        registerHandlers,
        handlers: handlersRef
      }}
    >
      {children}
    </JarvisContext.Provider>
  );
}

export function useJarvis() {
  const ctx = useContext(JarvisContext);
  if (!ctx) throw new Error('useJarvis must be used inside JarvisProvider');
  return ctx;
}