import { useEffect, useRef, useState } from 'react';
import { interviewApi } from '@/services/interview';

interface ConversationSession {
  startSession: (config: any) => Promise<any>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export default function InterviewPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const conversationRef = useRef<any>(null);
  const logsRef = useRef<string[]>([]);

  const addLog = (message: string) => {
    logsRef.current.push(message);
    setLogs([...logsRef.current]);
  };

  const startInterview = async () => {
    try {
      addLog('Fetching signed URL from server...');

      // Get signed URL from backend
      const response = await interviewApi.getSignedUrl();

      if (!response.success) {
        addLog(`Error: ${response.message}`);
        return;
      }

      addLog('Loading ElevenLabs client...');

      // Dynamically import ElevenLabs client
      const { Conversation } = await import('@elevenlabs/client');

      addLog('Starting conversation session...');

      // Start conversation with ElevenLabs
      conversationRef.current = await Conversation.startSession({
        signedUrl: response.signedUrl,
        connectionType: 'websocket',
        dynamicVariables: {
          job_role: 'Software Engineer',
          company_name: 'Alumni Connect',
        },
      });

      setIsConversationActive(true);
      addLog('Conversation started. Microphone access required.');

      // Set up event listeners
      conversationRef.current.onStatusChange = (status: string) => {
        addLog(`[Status] ${status}`);
      };

      conversationRef.current.onTranscript = (transcript: { from: string; text: string }) => {
        addLog(`${transcript.from}: ${transcript.text}`);
      };

      conversationRef.current.onError = (error: Error) => {
        addLog(`[Error] ${error.message}`);
      };
    } catch (error) {
      const err = error as Error;
      addLog(`Error: ${err.message}`);
      console.error('Interview error:', error);
      setIsConversationActive(false);
    }
  };

  const stopInterview = async () => {
    try {
      if (conversationRef.current) {
        addLog('Ending conversation...');
        await conversationRef.current.endSession();
        setIsConversationActive(false);
        addLog('Conversation ended.');
      }
    } catch (error) {
      const err = error as Error;
      addLog(`Error ending conversation: ${err.message}`);
      console.error('Stop interview error:', error);
    }
  };

  useEffect(() => {
    // Add script tag for ElevenLabs client if needed
    return () => {
      // Cleanup: end conversation if component unmounts
      if (conversationRef.current && isConversationActive) {
        conversationRef.current.endSession().catch(console.error);
      }
    };
  }, [isConversationActive]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>AI Interview Session</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={startInterview}
          disabled={isConversationActive}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            cursor: isConversationActive ? 'not-allowed' : 'pointer',
            opacity: isConversationActive ? 0.5 : 1,
          }}
        >
          Start Interview
        </button>
        <button
          onClick={stopInterview}
          disabled={!isConversationActive}
          style={{
            padding: '10px 20px',
            cursor: !isConversationActive ? 'not-allowed' : 'pointer',
            opacity: !isConversationActive ? 0.5 : 1,
          }}
        >
          Stop Interview
        </button>
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '400px',
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>
    </div>
  );
}
