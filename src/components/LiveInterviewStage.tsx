import React, { useState, useEffect, useRef } from 'react';
import { AgentId, LiveChatMessage, BackchannelWhisper } from '../types';
import { AGENT_PROFILES } from '../lib/agents';
import { speechManager } from '../lib/speech';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Gavel, 
  Eye, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface LiveInterviewStageProps {
  candidateName: string;
  targetRole: string;
  onConcludeToPipeline: (generatedTranscript: string) => void;
}

export const LiveInterviewStage: React.FC<LiveInterviewStageProps> = ({
  candidateName,
  targetRole,
  onConcludeToPipeline,
}) => {
  const [messages, setMessages] = useState<LiveChatMessage[]>([
    {
      id: 'msg-1',
      speaker: 'hiring_manager',
      text: `Welcome to your panel interview, ${candidateName}. We've reviewed your background for the ${targetRole} position. To start, walk us through a recent high-impact system you designed or a challenging technical trade-off you had to navigate.`,
      timestamp: '00:01',
      topic: 'Introduction & System Overview'
    }
  ]);

  const [whispers, setWhispers] = useState<BackchannelWhisper[]>([
    {
      id: 'wh-1',
      senderId: 'skeptic',
      targetId: 'technical',
      timestamp: '00:03',
      thought: 'Let\'s verify whether the candidate gives concrete architecture numbers or stays in high-level buzzwords.',
      flag: 'probing'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<AgentId | null>(null);
  const [isMuted, setIsMuted] = useState(speechManager.getMuted());
  const [seconds, setSeconds] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    speechManager.onSpeakingChange((speaking, agentId) => {
      setActiveSpeaker(speaking ? (agentId || null) : null);
    });
  }, []);

  // Web Speech STT setup
  const handleToggleVoice = () => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: LiveChatMessage = {
      id: `msg-${Date.now()}-cand`,
      speaker: 'candidate',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Dynamic Turn Simulation with Secret Whispers
    setTimeout(async () => {
      const currentCount = messages.filter(m => m.speaker === 'candidate').length;

      if (currentCount === 0) {
        // Technical Agent Dr. Vance tags in
        setWhispers(prev => [
          {
            id: `wh-${Date.now()}-1`,
            senderId: 'technical',
            targetId: 'skeptic',
            timestamp: '01:15',
            thought: 'Candidate brought up Redis & Kafka. Let\'s test their partition rebalance & idempotency depth.',
            flag: 'gap'
          },
          ...prev
        ]);

        const nextQuestion = "When you deployed that asynchronous Kafka pipeline, how did you guarantee idempotency during consumer partition rebalance, and what was your storage recovery strategy?";
        const agentMsg: LiveChatMessage = {
          id: `msg-${Date.now()}-tech`,
          speaker: 'technical',
          text: nextQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topic: 'Concurrency & Partition Tolerance'
        };

        setMessages(prev => [...prev, agentMsg]);
        await speechManager.speak(nextQuestion, 'technical');
      } else if (currentCount === 1) {
        // Skeptic Agent Rachel tags in
        setWhispers(prev => [
          {
            id: `wh-${Date.now()}-2`,
            senderId: 'skeptic',
            targetId: 'hiring_manager',
            timestamp: '02:30',
            thought: 'They answered the Redis lock question well. Let\'s challenge whether this was overkill vs simpler SQL queues.',
            flag: 'probing'
          },
          ...prev
        ]);

        const nextQuestion = "Why maintain the operational complexity of a full Kafka cluster instead of using PostgreSQL SKIP LOCKED? How did you justify the maintenance burden to your on-call team?";
        const agentMsg: LiveChatMessage = {
          id: `msg-${Date.now()}-skep`,
          speaker: 'skeptic',
          text: nextQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topic: 'Pragmatism & Simplicity'
        };

        setMessages(prev => [...prev, agentMsg]);
        await speechManager.speak(nextQuestion, 'skeptic');
      } else {
        // Culture Lead Elena tags in
        setWhispers(prev => [
          {
            id: `wh-${Date.now()}-3`,
            senderId: 'culture',
            targetId: 'hiring_manager',
            timestamp: '03:45',
            thought: 'High technical rigor demonstrated. Checking psychological safety & blameless post-mortem habits.',
            flag: 'strength'
          },
          ...prev
        ]);

        const nextQuestion = "When this architecture experienced an unexpected regression in production, how did you lead the post-mortem, and what systemic safeguards were implemented?";
        const agentMsg: LiveChatMessage = {
          id: `msg-${Date.now()}-cult`,
          speaker: 'culture',
          text: nextQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topic: 'Leadership & Post-Mortem Culture'
        };

        setMessages(prev => [...prev, agentMsg]);
        await speechManager.speak(nextQuestion, 'culture');
      }
    }, 1000);
  };

  const handleFinishAndConclude = () => {
    // Format transcript string to feed into Step 1 Fact Extractor / Debate Pipeline
    const formattedTranscript = messages.map(m => {
      const speakerName = m.speaker === 'candidate' ? candidateName : AGENT_PROFILES[m.speaker]?.name;
      return `[${speakerName}]: "${m.text}"`;
    }).join('\n\n');

    onConcludeToPipeline(formattedTranscript);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const QUICK_REPLIES = [
    'We used Redis SET NX with 60s TTL idempotency keys to prevent duplicate transaction state changes.',
    'Postgres SKIP LOCKED hit connection pool saturation at 45k req/s, which demanded Kafka for broker throughput.',
    'I ran a blameless post-mortem, published the root cause analysis, and introduced automated canary deployments.'
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-5 text-slate-100 animate-in fade-in duration-300">
      {/* Top Panel Stage Header */}
      <div className="bg-boardroom-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md">
            HS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{targetRole}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse">
                ● LIVE HOT SEAT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Candidate: <span className="text-white font-medium">{candidateName}</span> • 4 AI Interviewers in Room
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-boardroom-850 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(seconds)}</span>
          </div>

          <button
            onClick={() => {
              const next = !isMuted;
              speechManager.setMuted(next);
              setIsMuted(next);
            }}
            className="p-2 rounded-xl bg-boardroom-850 border border-slate-700 text-slate-300 hover:text-white text-xs"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleFinishAndConclude}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
          >
            <Gavel className="w-4 h-4" />
            <span>Conclude & Run 4-Agent Debate</span>
          </button>
        </div>
      </div>

      {/* 4 Agent Seats at the Top of the Boardroom */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {Object.entries(AGENT_PROFILES).map(([agentKey, agent]) => {
          const isSpeaking = activeSpeaker === agentKey;

          return (
            <div
              key={agentKey}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isSpeaking
                  ? `${agent.borderColor} bg-boardroom-850 ring-2 ring-indigo-500/50 shadow-xl scale-[1.02]`
                  : 'bg-boardroom-900 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl ${agent.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow`}>
                  {agent.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
                  <p className={`text-[10px] font-semibold ${agent.accentColor} truncate`}>{agent.roleTitle.split('/')[0]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                <span className="text-slate-400">{agent.domain.split('&')[0]}</span>
                {isSpeaking ? (
                  <span className="text-indigo-400 font-bold animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Speaking
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono">Listening</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Layout: Left Dialogue (8 cols), Right Secret Whispers (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[460px]">
        {/* Left Column: Live Dialogue Stream + Input */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-boardroom-900 border border-slate-800 rounded-3xl p-5 flex-1 max-h-[380px] overflow-y-auto space-y-4 shadow-xl">
            {messages.map((msg) => {
              const isCandidate = msg.speaker === 'candidate';
              const agent = isCandidate ? null : AGENT_PROFILES[msg.speaker as AgentId];

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    {!isCandidate && agent && (
                      <>
                        <span className={`font-bold ${agent.accentColor}`}>{agent.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                      </>
                    )}
                    {isCandidate && (
                      <>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                        <span className="font-bold text-indigo-300">{candidateName}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isCandidate
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                        : `bg-boardroom-850 border ${agent?.borderColor || 'border-slate-800'} text-slate-200 rounded-tl-none`
                    }`}
                  >
                    {msg.topic && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-boardroom-900 text-slate-300 border border-slate-800 mb-2">
                        {msg.topic}
                      </span>
                    )}
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Candidate Input Box */}
          <div className="bg-boardroom-900 border border-slate-800 rounded-3xl p-4 space-y-2.5 shadow-xl">
            {/* Quick Answer Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 whitespace-nowrap">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Quick Chips:
              </span>
              {QUICK_REPLIES.map((rep, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(rep)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-boardroom-850 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-indigo-500/50 transition-colors"
                >
                  {rep.slice(0, 40)}...
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Type your response to the panel... (or use Voice Mic)"
                className="flex-1 bg-boardroom-850 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-boardroom-850 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Voice STT"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Secret Interviewer Whispers Stream */}
        <div className="lg:col-span-4 bg-boardroom-900 border border-slate-800 rounded-3xl p-4 flex flex-col h-full shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Secret Backchannel
                </h4>
                <p className="text-[10px] text-slate-500">Live AI-to-AI whisper stream</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {whispers.length} whispers
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[460px]">
            {whispers.map((wh) => {
              const sender = AGENT_PROFILES[wh.senderId];
              const target = wh.targetId ? AGENT_PROFILES[wh.targetId] : null;

              return (
                <div
                  key={wh.id}
                  className="bg-boardroom-850 border border-slate-800/80 rounded-2xl p-3 text-xs space-y-1.5 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold ${sender?.accentColor}`}>{sender?.name.split(' ')[0]}</span>
                      {target && (
                        <>
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                          <span className={`font-semibold ${target.accentColor}`}>{target.name.split(' ')[0]}</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{wh.timestamp}</span>
                  </div>
                  <p className="text-slate-300 italic text-[11px] leading-relaxed">
                    "{wh.thought}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
