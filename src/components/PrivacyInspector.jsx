import React, { useEffect, useRef } from 'react';
import { usePrivacy } from '../utils/PrivacyContext';
import { Shield, X, Lock, Eye, ArrowRight, Zap, Info, Fingerprint } from 'lucide-react';

export default function PrivacyInspector() {
  const { logs, isInspectorOpen, setIsInspectorOpen } = usePrivacy();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  const highlightRedacted = (text) => {
    if (!text) return null;
    
    // Pattern for [ENTITY_TYPE_N]
    const parts = text.split(/(\[[A-Z_]+_\d+\])/g);
    
    return parts.map((part, i) => {
      if (part.match(/^\[[A-Z_]+_\d+\]$/)) {
        return (
          <span 
            key={i} 
            className="bg-accent-900 text-accent-400 px-1.5 py-0.5 rounded border border-accent-700/50 font-bold mx-0.5 text-[10px] shadow-sm animate-pulse"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (!isInspectorOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 text-gray-100 shadow-2xl z-[100] flex flex-col border-l border-gray-700 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-accent-400 mr-2" />
          <h2 className="text-lg font-bold">Privacy Inspector</h2>
        </div>
        <button 
          onClick={() => setIsInspectorOpen(false)}
          className="p-1 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center text-xs text-gray-400 mb-2 uppercase tracking-widest font-semibold">
          <Zap className="h-3 w-3 mr-1 text-yellow-500" />
          Live Redaction Log
        </div>
        <p className="text-xs text-gray-400">
          This window shows the real-time redaction process happening inside the Secure Enclave.
        </p>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2 italic text-center">
            <Lock className="h-10 w-10 opacity-20" />
            <p>No activity yet.<br/>Upload a document or ask a question to see redaction in action.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-gray-800 rounded border border-gray-700 overflow-hidden">
              <div className="px-3 py-1.5 bg-gray-700/50 border-b border-gray-700 flex justify-between items-center">
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                  log.type === 'redaction' ? 'bg-accent-900/50 text-accent-400' :
                  log.type === 'query' ? 'bg-blue-900/50 text-blue-400' :
                  'bg-purple-900/50 text-purple-400'
                }`}>
                  {log.type}
                </span>
                <span className="text-[10px] text-gray-500">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="p-3">
                <p className="text-gray-200 mb-2">{log.message}</p>
                
                {log.details && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-gray-700/50">
                    {log.details.original && (
                      <div className="text-[11px]">
                        <div className="text-gray-500 mb-1 flex items-center">
                          <Eye className="h-3 w-3 mr-1" /> Original Input:
                        </div>
                        <div className="bg-gray-950 p-2 rounded text-gray-400 break-words line-clamp-3">
                          {log.details.original}
                        </div>
                      </div>
                    )}
                    
                    {log.details.redacted && (
                      <div className="text-[11px]">
                        <div className="text-accent-400 mb-1 flex items-center font-bold">
                          <Shield className="h-3 w-3 mr-1" /> Redacted (Sent to AI):
                        </div>
                        <div className="bg-gray-950 p-2.5 rounded text-gray-300 break-words border border-accent-900/30 leading-relaxed">
                          {highlightRedacted(log.details.redacted)}
                        </div>
                      </div>
                    )}

                    {log.details.piiFound > 0 && (
                      <div className="flex items-center text-[10px] text-yellow-400 bg-yellow-900/30 p-2 rounded border border-yellow-900/50">
                        <Fingerprint className="h-3 w-3 mr-2" />
                        <span>
                          <span className="font-bold">{log.details.piiFound} PII entities</span> neutralized inside the TEE
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-900 text-[10px] text-gray-500 flex items-center">
        <Lock className="h-3 w-3 mr-2" />
        SECURE ENCLAVE ACTIVE • AES-256 ENCRYPTED
      </div>
    </div>
  );
}

