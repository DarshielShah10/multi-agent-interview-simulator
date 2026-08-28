import React, { useState, useEffect } from 'react';
import { AgentId, DebateTurn } from '../types';
import { AGENT_PROFILES } from '../lib/agents';
import { speechManager } from '../lib/speech';
import { Volume2, VolumeX, MessageSquare, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface DebateRoomProps {
  debateTurns: DebateTurn[];
  onSynthesizeFinalReport: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const DebateRoom: React.FC<DebateRoomProps> = ({
  debateTurns,
  onSynthesizeFinalReport,
  onBack,
  isLoading,
}) => {
  const [isMuted, setIsMuted] = useState(speechManager.getMuted());
  const [activeSpeaker, setActiveSpeaker] = useState<AgentId | null>(null);

  useEffect(() => {
    speechManager.onSpeakingChange((_speaking, agentId) => {
      setActiveSpeaker(agentId || null);
    });
  }, []);

  const handlePlayTurn = async (turn: DebateTurn) => {
    setActiveSpeaker(turn.speakerId);
    await speechManager.speak(turn.speech, turn.speakerId);
    setActiveSpeaker(null);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    speechManager.setMuted(next);
    setIsMuted(next);
  };

  const getResponseTypeBadge = (type: DebateTurn['responseType']) => {
    switch (type) {
      case 'opinion_shift':
        return { label: 'Changed Opinion / Shifted Stance', color: 'text-pink-300 bg-pink-950/80 border-pink-500/50' };
      case 'challenge':
        return { label: 'Cross-Examining / Challenged Peer', color: 'text-amber-300 bg-amber-950/80 border-amber-500/50' };
      case 'agreement':
        return { label: 'Agreed & Reinforced Evidence', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50' };
      default:
        return { label: 'Clarification', color: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/50' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-boardroom-900 via-boardroom-850 to-indigo-950/60 border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Step 3: Multi-Agent Interactive Voice Debate
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Hiring Committee Cross-Debate Room
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Agents actively debate each other's points, challenge assertions, and update their stances based on evidence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleMute}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                isMuted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-boardroom-850 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Unmute AI Voices' : 'AI Voices Enabled'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Agent Seats at the Table */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(AGENT_PROFILES).map(([agentKey, agent]) => {
          const isSpeaking = activeSpeaker === agentKey;

          return (
            <div
              key={agentKey}
              className={`p-3.5 rounded-2xl border transition-all ${
                isSpeaking
                  ? `${agent.borderColor} bg-boardroom-850 ring-2 ring-indigo-500 shadow-xl scale-105`
                  : 'bg-boardroom-900 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${agent.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow`}>
                  {agent.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{agent.name}</p>
                  <p className={`text-[10px] ${agent.accentColor} truncate`}>{agent.roleTitle.split('/')[0]}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Debate Dialogue Stream */}
      <div className="bg-boardroom-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4 max-h-[620px] overflow-y-auto shadow-2xl">
        {debateTurns.map((turn, idx) => {
          const speaker = AGENT_PROFILES[turn.speakerId];
          const target = turn.targetAgentId ? AGENT_PROFILES[turn.targetAgentId] : null;
          const badge = getResponseTypeBadge(turn.responseType);
          const isCurrentlySpeaking = activeSpeaker === turn.speakerId;

          return (
            <div
              key={turn.id || idx}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${
                isCurrentlySpeaking
                  ? `${speaker.borderColor} bg-boardroom-850 ring-1 ring-indigo-500/50 shadow-xl`
                  : 'border-slate-800/80 bg-boardroom-850/60'
              }`}
            >
              {/* Turn Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${speaker.avatarBg} text-white font-bold flex items-center justify-center text-xs`}>
                    {speaker.name.charAt(0)}
                  </div>
                  <span className={`font-bold text-sm ${speaker.accentColor}`}>{speaker.name}</span>
                  {target && (
                    <>
                      <span className="text-xs text-slate-500">addressing</span>
                      <span className={`font-semibold text-xs ${target.accentColor}`}>{target.name}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Rebuttal Type Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>

                  {/* Replay Voice button */}
                  <button
                    onClick={() => handlePlayTurn(turn)}
                    className="p-1.5 rounded-lg bg-boardroom-900 border border-slate-800 hover:border-indigo-500 text-slate-400 hover:text-white text-xs transition-colors"
                    title="Play Voice"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Debate Speech */}
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {turn.speech}
              </p>

              {/* Stance Shift Notice if Present */}
              {turn.stanceShiftReason && (
                <div className="mt-3 p-2.5 rounded-xl bg-pink-950/40 border border-pink-800/50 text-xs text-pink-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Stance Shifted to {turn.revisedStance}:</span> {turn.stanceShiftReason}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-boardroom-850 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Independent Reviews</span>
        </button>

        <button
          onClick={onSynthesizeFinalReport}
          disabled={isLoading}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>Synthesize Step 4: Final Reasoned Decision</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
