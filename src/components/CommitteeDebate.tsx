import React, { useEffect, useRef } from 'react';
import { CommitteeTurn, InterviewerId } from '../types';
import { INTERVIEWERS } from '../lib/agents';
import { Gavel, CheckCircle2, TrendingUp, Award, ArrowRight } from 'lucide-react';

interface CommitteeDebateProps {
  turns: CommitteeTurn[];
  isDeliberating: boolean;
  currentSpeaker: InterviewerId | null;
  onViewScorecard: () => void;
}

export const CommitteeDebate: React.FC<CommitteeDebateProps> = ({
  turns,
  isDeliberating,
  currentSpeaker,
  onViewScorecard,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  const getStanceBadge = (stance: CommitteeTurn['stance']) => {
    switch (stance) {
      case 'Strong Hire':
        return 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50';
      case 'Hire':
        return 'text-indigo-300 bg-indigo-950/80 border-indigo-500/50';
      case 'Leaning No Hire':
        return 'text-amber-300 bg-amber-950/80 border-amber-500/50';
      default:
        return 'text-rose-300 bg-rose-950/80 border-rose-500/50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 animate-in fade-in zoom-in-95 duration-300">
      {/* Deliberation Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-boardroom-900 to-indigo-950/60 border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold mb-2">
              <Gavel className="w-3.5 h-3.5" />
              Autonomous Hiring Board Session
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Hiring Committee Deliberation Room
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Watch the 3 AI interviewers debate performance, calibrate criteria, and converge on a consensus decision.
            </p>
          </div>

          {/* Deliberation Status Indicator */}
          <div className="flex items-center gap-3">
            {isDeliberating ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>Committee Debating...</span>
              </div>
            ) : (
              <button
                onClick={onViewScorecard}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <Award className="w-4 h-4" />
                <span>View Full Scorecard & Rubric</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Deliberation Conversation Stream */}
      <div className="bg-boardroom-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 max-h-[600px] overflow-y-auto shadow-xl">
        {turns.map((turn) => {
          const agent = INTERVIEWERS[turn.agentId];
          const isCurrentlySpeaking = currentSpeaker === turn.agentId;

          return (
            <div
              key={turn.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isCurrentlySpeaking
                  ? `${agent.borderColor} bg-boardroom-850 ring-1 ring-indigo-500/40 shadow-lg`
                  : 'border-slate-800/80 bg-boardroom-850/60'
              }`}
            >
              {/* Agent info & Stance Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${agent.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow`}>
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${agent.accentColor}`}>
                        {agent.name}
                      </span>
                      <span className="text-[11px] text-slate-500">({agent.companyRole})</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Topic: <span className="text-slate-300 font-medium">{turn.highlightCriterion}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Confidence Meter */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Confidence:</span>
                    <span className="font-mono font-semibold text-white">{turn.confidence}%</span>
                  </div>

                  {/* Stance Badge */}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStanceBadge(turn.stance)}`}>
                    {turn.stance}
                  </span>
                </div>
              </div>

              {/* Debate Speech */}
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {turn.speech}
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Completion CTA */}
      {!isDeliberating && turns.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onViewScorecard}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-purple-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Generate & Inspect 360° Candidate Scorecard</span>
          </button>
        </div>
      )}
    </div>
  );
};
