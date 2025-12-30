import { createContext, useContext, useState, useCallback } from 'react';

const PrivacyContext = createContext();

export function PrivacyProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [hasNewLogs, setHasNewLogs] = useState(false);

  const addLog = useCallback((type, message, details = null) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date(),
      type, // 'upload', 'query', 'redaction'
      message,
      details,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
    
    // Set notification flag if inspector is closed
    setHasNewLogs(true);
  }, []);

  const toggleInspector = () => {
    setIsInspectorOpen(!isInspectorOpen);
    if (!isInspectorOpen) {
      setHasNewLogs(false);
    }
  };

  return (
    <PrivacyContext.Provider value={{ 
      logs, 
      addLog, 
      isInspectorOpen, 
      toggleInspector, 
      setIsInspectorOpen,
      hasNewLogs,
      setHasNewLogs
    }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

