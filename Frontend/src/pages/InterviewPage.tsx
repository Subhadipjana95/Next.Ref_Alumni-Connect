import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { interviewApi } from '@/services/interview';
import { opportunitiesApi } from '@/services/opportunities';

interface ConversationSession {
  startSession: (config: any) => Promise<any>;
}

interface OpportunityData {
  jobTitle: string;
  postedBy: {
    company: string;
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export default function InterviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const opportunityId = searchParams.get('opportunityId');
  
  const [logs, setLogs] = useState<string[]>([]);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [opportunityData, setOpportunityData] = useState<OpportunityData | null>(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  
  const conversationRef = useRef<any>(null);
  const logsRef = useRef<string[]>([]);

  const addLog = (message: string) => {
    logsRef.current.push(message);
    setLogs([...logsRef.current]);
  };

  // Fetch opportunity data on mount
  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        if (!opportunityId) {
          addLog('Error: No opportunity ID provided');
          setIsLoading(false);
          return;
        }

        addLog('Loading opportunity details...');
        const response = await opportunitiesApi.getOpportunities();
        
        const opportunity = response.data.find((opp: any) => opp._id === opportunityId);
        if (opportunity) {
          setOpportunityData({
            jobTitle: opportunity.jobTitle,
            postedBy: {
              company: opportunity.postedBy.company,
            },
          });
          addLog(`Opportunity loaded: ${opportunity.jobTitle}`);
        } else {
          addLog('Error: Opportunity not found');
        }
      } catch (error) {
        const err = error as Error;
        addLog(`Error loading opportunity: ${err.message}`);
        console.error('Fetch opportunity error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunityData();
  }, [opportunityId]);

  const startInterview = async () => {
    try {
      if (!opportunityData) {
        addLog('Error: Opportunity data not loaded');
        return;
      }

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

      // Start conversation with ElevenLabs using opportunity data
      conversationRef.current = await Conversation.startSession({
        signedUrl: response.signedUrl,
        connectionType: 'websocket',
        dynamicVariables: {
          job_role: opportunityData.jobTitle,
          company_name: opportunityData.postedBy.company,
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
        setInterviewCompleted(true);
        addLog('Interview completed. You can now apply for this referral.');
      }
    } catch (error) {
      const err = error as Error;
      addLog(`Error ending conversation: ${err.message}`);
      console.error('Stop interview error:', error);
    }
  };

  const handleApplyAfterInterview = async () => {
    try {
      if (!opportunityId) {
        addLog('Error: Opportunity ID missing');
        return;
      }

      addLog('Submitting your application...');
      await opportunitiesApi.applyForReferral(opportunityId);
      addLog('Application submitted successfully!');
      
      // Redirect back to student dashboard after a short delay
      setTimeout(() => {
        navigate('/student?tab=applied');
      }, 2000);
    } catch (error) {
      const err = error as Error;
      addLog(`Error submitting application: ${err.message}`);
      console.error('Apply error:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (conversationRef.current && isConversationActive) {
        conversationRef.current.endSession().catch(console.error);
      }
    };
  }, [isConversationActive]);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>AI Interview Session</h1>
        <p>Loading opportunity details...</p>
      </div>
    );
  }

  if (!opportunityData) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>AI Interview Session</h1>
        <p style={{ color: 'red' }}>Error: Could not load opportunity details</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>AI Interview Session</h1>
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p><strong>Position:</strong> {opportunityData.jobTitle}</p>
        <p><strong>Company:</strong> {opportunityData.postedBy.company}</p>
      </div>

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
            marginRight: '10px',
            cursor: !isConversationActive ? 'not-allowed' : 'pointer',
            opacity: !isConversationActive ? 0.5 : 1,
          }}
        >
          Stop Interview
        </button>
        {interviewCompleted && (
          <button
            onClick={handleApplyAfterInterview}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
              border: 'none',
            }}
          >
            Apply for Referral
          </button>
        )}
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
