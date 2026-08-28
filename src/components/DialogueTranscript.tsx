import React, { useEffect, useRef } from 'react';
import { ChatMessage, InterviewerId } from '../types';
import { INTERVIEWERS } from '../lib/agents';
import { User, Volume2, Sparkles, MessageSquare } from 'lucide-react';
import { speechManager } from '../lib/speech';

interface DialogueTranscriptProps {
  messages: ChatMessage[];
  currentSpeaker: InterviewerId | null;
  candidateName: string;
}

export const DialogueTranscript: React.FC<DialogueTranscriptProps> = ({
  messages,
  candidateName,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReplayAudio = (text: string, agentId?: InterviewerId) => {
    if (agentId) {
      speechManager.speak(text, agentId);
    }
  };

  return (
    <div className="bg-boardroom-900 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col h-full overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live Stage Dialogue
            </h3>
            <p className="text-[10px] text-slate-400">
              Direct questioning and cross-examination transcript
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          {messages.length} exchanges
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => {
          const isCandidate = msg.speaker === 'candidate';
          const interviewer = msg.interviewerId ? INTERVIEWERS[msg.interviewerId] : null;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              {/* Speaker Metadata */}
              <div className="flex items-center gap-2 text-xs">
                {!isCandidate && interviewer && (
                  <>
                    <div className={`w-5 h-5 rounded-full ${interviewer.avatarBg} text-[10px] text-white font-bold flex items-center justify-center`}>
                      {interviewer.name.charAt(0)}
                    </div>
                    <span className={`font-bold ${interviewer.accentColor}`}>
                      {interviewer.name}
                    </span>
                    <span className="text-[10px] text-slate-500">• {interviewer.companyRole}</span>
                  </>
                )}
                {isCandidate && (
                  <>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                    <span className="font-bold text-indigo-300">{candidateName}</span>
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <User className="w-3 h-3" />
                    </div>
                  </>
                )}
                {!isCandidate && (
                  <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative ${
                  isCandidate
                    ? 'bg-indigo-600/90 text-white rounded-tr-none shadow-md shadow-indigo-600/10'
                    : `bg-boardroom-850 border ${interviewer?.borderColor || 'border-slate-800'} text-slate-200 rounded-tl-none`
                }`}
              >
                {/* Topic Badge if interviewer question */}
                {msg.questionTopic && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-boardroom-900 text-slate-300 border border-slate-700/60 mb-2">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                    <span>{msg.questionTopic}</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Replay Audio Button for Interviewer */}
                {!isCandidate && msg.interviewerId && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-end">
                    <button
                      onClick={() => handleReplayAudio(msg.text, msg.interviewerId)}
                      title="Replay Voice"
                      className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-boardroom-900 border border-slate-800 hover:border-indigo-500/40"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Replay Voice</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
